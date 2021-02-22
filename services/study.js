const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');
const alertDao = require('../dao/alert');
const { push } = require('./push');
const { PushEventEnum, AuthEnum, RedisEventEnum } = require('../utils/variables/enum');
const { getUserLocation } = require('../dao/common');
const { rowSplit, toBoolean, locationMerge, cutId, lengthSorting } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const broadcast = require('../events/broadcast');
const { redisTrigger, getUser } = require('./redis');

const User = require('../models/user');
const Room = require('../models/room');
const Chat = require('../models/chat');
const Search = require('../models/search');

const createStudy = async ({ id: user_id }, createData) => {
  const checkRows = await studyDao.checkTitle(createData.title);
  if (checkRows.length > 0) {
    throw customError(400, '중복된 스터디 이름이 존재합니다');
  }
  const createRows = await studyDao.createStudy(user_id, createData);

  Room.create({
    study_id: createRows.insertId,
    study_title: createData.title,
    members: [user_id],
  });
  User.updateOne({ user_id }, { $push: { rooms: createRows.insertId } }, { upsert: true }).exec();
  redisTrigger(user_id, RedisEventEnum.participate, { study_id: createRows.insertId });
  return createRows.insertId;
};

const getStudy = async ({ id: user_id }, { study_id }) => {
  let studyRows = await studyDao.getStudy(study_id);
  if (studyRows.length === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
  studyRows = toBoolean(studyRows, ['Pleader']);
  studyRows = rowSplit(studyRows, ['participate']);
  studyRows = locationMerge(studyRows);

  const badgeCount = await redisTrigger(user_id, RedisEventEnum.alert_read, { study_id }); // 0으로 변경
  const badge = {
    alert: badgeCount.alert.total,
    total: badgeCount.badge,
  };

  return {
    studyInfo: studyRows,
    badge,
  };
};

const studyUpdate = async ({ study_id }, updateData, filedata) => {
  try {
    if (updateData.title) {
      const checkRows = await studyDao.checkTitle(updateData.title);
      if (checkRows.length > 0) {
        throw customError(400, '중복된 스터디 이름이 존재합니다');
      }
      Room.updateOne({ study_id }, { study_title: updateData.title }).exec();
    }

    if (filedata) {
      const { destination, uploadedFile, path: _tmpPath } = filedata;
      const previousPath = await studyDao.getImage(study_id);
      const updateRows = await studyDao.studyUpdate(study_id, updateData);
      if (previousPath.length === 0 || updateRows.affectedRows === 0) {
        throw customError(404, '조회된 스터디가 없습니다');
      }
      const oldImagePath = path.join(destination, path.basename(previousPath[0].image));
      try {
        fs.unlink(oldImagePath, (err) => {});
      } catch (err) {}
      const newPath = path.join(destination, uploadedFile.basename);
      fs.rename(_tmpPath, newPath, (err) => {});
    } else {
      const updateRows = await studyDao.studyUpdate(study_id, updateData);
      if (updateRows.affectedRows === 0) {
        throw customError(404, '조회된 스터디가 없습니다');
      }
    }

    if (updateData.title) {
      await alertDao.updateStudyTitle(study_id, updateData.title);
    }
    push(PushEventEnum.study_update, study_id);
  } catch (err) {
    console.log(err);
  }
};

const studyDelete = async ({ id: host_id }, { study_id }) => {
  const [userRows, studyRows] = await studyDao.studyDelete(study_id);
  if (studyRows.affectedRows === 0) {
    throw customError(400, '스터디 삭제 실패');
  }
  Room.deleteOne({ study_id }).exec();
  Chat.deleteMany({ study_id }).exec();

  userRows.forEach(({ user_id }) => {
    if (host_id !== user_id) {
      push(PushEventEnum.study_delete, study_id, user_id);
    }
    User.updateOne({ user_id }, { $pull: { rooms: study_id } }).exec();
    redisTrigger(user_id, RedisEventEnum.leave, { study_id });
  });
};

const getMyStudy = async ({ id }) => {
  const myStudyList = await studyDao.getMyStudy(id);
  const badgeCount = await getUser(id);

  return {
    study_list: myStudyList,
    badge: {
      alert: badgeCount.alert.total,
      total: badgeCount.badge,
    },
  };
};

const getStudyList = async ({ id: user_id }, { category, sort }) => {
  let studyListRows = '';
  if (sort === 'length') {
    const userData = await getUserLocation(user_id);
    studyListRows = await studyDao.getStudyListByLength(userData[0], user_id, category);
    studyListRows = lengthSorting(userData[0].sigungu, studyListRows);
  } else if (sort === 'new') {
    studyListRows = await studyDao.getStudyListByNew(user_id, category);
  } else {
    throw customError(400, 'sort 입력이 잘못되었습니다');
  }

  studyListRows = toBoolean(studyListRows, ['is_member']);
  return cutId(studyListRows);
};

const studyPaging = async ({ id: user_id }, query) => {
  let studyListRows = [];
  const studyKeys = query.values.split(',');
  studyKeys.length = process.env.paging_size;

  if (query.option === 'distance') {
    const userData = await getUserLocation(user_id);
    studyListRows = await studyDao.studyPagingByLength(userData[0], user_id, studyKeys);
  } else {
    studyListRows = await studyDao.studyPaging(user_id, studyKeys);
  }

  return toBoolean(studyListRows, ['is_member']);
};

const leaveStudy = async ({ id, nickname }, { study_id }, authority) => {
  if (authority === AuthEnum.host) {
    const participateRows = await studyDao.getStudy(study_id);
    if (participateRows.length > 1) {
      throw customError(400, '탈퇴할 수 없습니다. 스터디 장을 위임한 뒤 탈퇴하세요', 101);
    }
    await studyDelete({ id }, { study_id });
  }

  if (authority === AuthEnum.member) {
    const participateRows = await studyDao.leaveStudy(id, study_id);
    if (participateRows[0].affectedRows === 0) {
      throw customError(400, '스터디 탈퇴 실패');
    }

    Room.updateOne({ study_id }, { $pull: { off_members: id, members: id } });
    User.updateOne({ user_id: id }, { $pull: { rooms: study_id } }).exec();
    redisTrigger(id, RedisEventEnum.leave, { study_id });
    broadcast.leave(study_id, nickname);
  }
};

const delegate = async ({ id: old_leader }, { study_id }, { new_leader }) => {
  if (old_leader === new_leader) {
    throw customError(400, '자기 자신에게 위임할 수 없습니다');
  }
  const { toLeaderRows, toParticipateRows } = await studyDao.delegate(study_id, old_leader, new_leader);
  if (toLeaderRows.affectedRows === 0 || toParticipateRows.affectedRows === 0) {
    throw customError(400, '위임 실패');
  }
  push(PushEventEnum.study_delegate, study_id, old_leader);
};

const search = async ({ id: user_id }, { word }) => {
  Search.updateOne({ word }, { $inc: { count: 1 } }, { upsert: true }).exec();
  word = '%' + word + '%';
  let searchRows = await studyDao.search(user_id, word);
  searchRows = toBoolean(searchRows, ['is_member']);
  return cutId(searchRows);
};

const ranking = async () => {
  return await Search.find({}, { word: true, _id: false }).sort({ count: -1 }).limit(5);
};

const category = async ({ id }) => {
  const categoryRows = await studyDao.getCategoryRanking(id);
  const temp = Object.entries(categoryRows[0]);
  temp.sort((a, b) => {
    return b[1] - a[1];
  });

  return temp.map((v) => {
    return v[0];
  });
};

const getChatting = async ({ study_id }, { date }) => {
  return await Chat.find({ study_id, date: { $gt: date } }, { _id: 0 });
};

module.exports = {
  createStudy,
  getStudy,
  studyUpdate,
  studyDelete,
  getMyStudy,
  getStudyList,
  studyPaging,
  leaveStudy,
  delegate,
  search,
  ranking,
  category,
  getChatting,
};
