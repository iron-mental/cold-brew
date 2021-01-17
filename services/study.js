const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');
const push = require('../events/push');
const { PushEventEnum, AuthEnum, RedisEventEnum } = require('../utils/variables/enum');
const { getUserLocation } = require('../dao/common');
const { rowSplit, toBoolean, locationMerge, cutId, lengthSorting } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const broadcast = require('../events/broadcast');

const User = require('../models/user');
const Room = require('../models/room');
const Chat = require('../models/chat');
const Search = require('../models/search');
const { redisTrigger } = require('./redis');

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
  redisTrigger(user_id, RedisEventEnum.participate, { study_id: insertId });
  return createRows.insertId;
};

const studyDetail = async ({ id: user_id }, { study_id }) => {
  let studyRows = await studyDao.getStudy(study_id);
  if (studyRows.length === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }

  studyRows = toBoolean(studyRows, ['Pleader']);
  studyRows = rowSplit(studyRows, ['participate']);

  redisTrigger(user_id, RedisEventEnum.alert_read, { study_id });
  return locationMerge(studyRows);
};

const studyUpdate = async ({ study_id }, updateData, filedata) => {
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
    const newPath = path.join(destination, uploadedFile.basename);
    fs.rename(_tmpPath, newPath, (err) => {});
    fs.unlink(oldImagePath, (err) => {});
  } else {
    const updateRows = await studyDao.studyUpdate(study_id, updateData);
    if (updateRows.affectedRows === 0) {
      throw customError(404, '조회된 스터디가 없습니다');
    }
  }

  push.emit('toStudyWithoutHost', PushEventEnum.study_update, study_id);
};

const studyDelete = async ({ id: user_id }, { study_id }) => {
  const studyRows = await studyDao.studyDelete(study_id);
  if (studyRows.affectedRows === 0) {
    throw customError(400, '스터디 삭제 실패');
  }

  Room.deleteOne({ study_id }).exec();
  User.updateOne({ user_id }, { $pull: { rooms: study_id } }).exec();
  // 멤버에게 노티 전송부
};

const myStudy = async ({ id }) => {
  const myStudyList = await studyDao.getMyStudy(id);
  return myStudyList;
};

const studyList = async ({ id: user_id }, { category, sort }) => {
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

  studyListRows = toBoolean(studyListRows, ['isMember']);
  return cutId(studyListRows);
};

const studyPaging = async ({ id: user_id }, studyKeys) => {
  const studyListRows = await studyDao.studyPaging(user_id, studyKeys);
  return toBoolean(studyListRows, ['isMember']);
};

const leaveStudy = async ({ id, nickname }, { study_id }, authority) => {
  if (authority === AuthEnum.host) {
    const participateRows = await studyDao.getStudy(study_id);
    if (participateRows.length > 1) {
      throw customError(400, '탈퇴할 수 없습니다. 스터디 장을 위임한 뒤 탈퇴하세요', 101);
    }
    const studyRows = await studyDao.studyDelete(study_id);
    if (studyRows.affectedRows === 0) {
      throw customError(400, '스터디 탈퇴 실패', 102);
    }
  }

  const { applyRows, participateRows } = await studyDao.leaveStudy(id, study_id);
  if (applyRows.affectedRows === 0 || participateRows.affectedRows === 0) {
    throw customError(400, '스터디 탈퇴 실패');
  }

  Room.updateOne({ study_id }, { $pull: { off_members: id, members: id } });
  User.updateOne({ user_id: id }, { $pull: { rooms: study_id } }).exec();

  broadcast.leave(study_id, nickname);
};

const delegate = async ({ id: old_leader }, { study_id }, { new_leader }) => {
  const { toLeaderRows, toParticipateRows } = await studyDao.delegate(study_id, old_leader, new_leader);
  if (toLeaderRows.affectedRows === 0 || toParticipateRows.affectedRows === 0) {
    throw customError(400, '위임 실패');
  }

  push.emit('toStudy', PushEventEnum.study_delegate, study_id);
};

const search = async ({ id: user_id }, { word }) => {
  Search.updateOne({ word }, { $inc: { count: 1 } }, { upsert: true }).exec();
  word = '%' + word + '%';
  let searchRows = await studyDao.search(user_id, word);

  searchRows = toBoolean(searchRows, ['isMember']);
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

const getChatting = async ({ id: user_id }, { study_id }, { date }) => {
  redisTrigger(user_id, RedisEventEnum.chat_read, { study_id });
  return await Chat.find({ study_id, date: { $gt: date } }, { _id: 0 });
};

module.exports = {
  createStudy,
  studyDetail,
  studyUpdate,
  studyDelete,
  myStudy,
  studyList,
  studyPaging,
  leaveStudy,
  delegate,
  search,
  ranking,
  category,
  getChatting,
};
