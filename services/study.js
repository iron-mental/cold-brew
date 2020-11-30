const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');
const { getUserLocation } = require('../dao/common');
const { rowSplit, toBoolean, locationMerge, cutId, customSorting } = require('../utils/query');
const { customError } = require('../utils/errors/customError');
const { authEnum } = require('../utils/variables/enums');

const User = require('../models/user');
const Room = require('../models/room');

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
  }).exec();
  User.updateOne({ user_id }, { $push: { rooms: createRows.insertId } }, { upsert: true }).exec();

  return createRows.insertId;
};

const studyDetail = async ({ study_id }) => {
  let studyRows = await studyDao.getStudy(study_id);
  if (studyRows.length === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }

  studyRows = toBoolean(studyRows, ['Pleader']);
  studyRows = rowSplit(studyRows, ['participate']);
  return locationMerge(studyRows);
};

const studyUpdate = async ({ study_id }, updateData, filedata) => {
  if (updateData.title) {
    const checkRows = await studyDao.checkTitle(updateData.title);
    if (checkRows.length > 0) {
      throw customError(400, '중복된 스터디 이름이 존재합니다');
    }
    Room.updateOne({ room_number: study_id }, { room_name: updateData.title }).exec();
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
};

const studyDelete = async ({ id: user_id }, { study_id }) => {
  const studyRows = await studyDao.studyDelete(study_id);
  if (studyRows.affectedRows === 0) {
    throw customError(400, '스터디 삭제 실패');
  }

  Room.deleteOne({ study_id }).exec();
  User.updateOne({ user_id }, { $pull: { rooms: study_id } }).exec();
  // 멤버에게 채팅 or 노티 전송부
};

const myStudy = async ({ id }) => {
  const myStudyList = await studyDao.getMyStudy(id);
  if (myStudyList.length === 0) {
    throw customError(404, '가입한 스터디가 없습니다');
  }
  return myStudyList;
};

const studyList = async ({ id: user_id }, { category, sort }) => {
  let studyListRows = '';
  if (sort === 'length') {
    const userData = await getUserLocation(user_id);
    studyListRows = await studyDao.getStudyListByLength(userData[0], category);
    studyListRows = customSorting(userData[0].sigungu, studyListRows);
  } else if (sort === 'new') {
    studyListRows = await studyDao.getStudyListByNew(category);
  } else {
    throw customError(404, 'sort 입력이 잘못되었습니다');
  }

  if (studyListRows.length === 0) {
    throw customError(404, '해당 카테고리에 스터디가 없습니다');
  }

  return cutId(studyListRows);
};

const studyPaging = async (studyKeys) => {
  return await studyDao.studyPaging(studyKeys);
};

const leaveStudy = async ({ id }, { study_id }, authority) => {
  if (authority === authEnum.host) {
    const participateRows = await studyDao.getStudy(study_id);
    if (participateRows.length > 1) {
      throw customError(400, '탈퇴할 수 없습니다. 스터디 장을 위임한 뒤 탈퇴하세요.');
    }
    const studyRows = await studyDao.studyDelete(study_id);
    if (studyRows.affectedRows === 0) {
      throw customError(400, '스터디 탈퇴 실패');
    }
  }

  const { applyRows, participateRows } = await studyDao.leaveStudy(id, study_id);
  if (applyRows.affectedRows === 0 || participateRows.affectedRows === 0) {
    throw customError(400, '스터디 탈퇴 실패');
  }

  Room.updateOne({ study_id }, { $pull: { off_members: id, members: id } });
  User.updateOne({ user_id: id }, { $pull: { rooms: study_id } }).exec();

  // 멤버에게 채팅 or 노티 전송부
};

const delegate = async ({ id: old_leader }, { study_id }, { new_leader }) => {
  const { toLeaderRows, toParticipateRows } = await studyDao.delegate(study_id, old_leader, new_leader);
  if (toLeaderRows.affectedRows === 0 || toParticipateRows.affectedRows === 0) {
    throw customError(400, '위임 실패');
  }

  // 멤버에게 채팅 or 노티 전송부
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
};
