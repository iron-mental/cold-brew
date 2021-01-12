const applyDao = require('../dao/apply');

const push = require('../events/push');
const { PushEventEnum } = require('../utils/variables/enum');
const broadcast = require('../events/broadcast');
const { rowSplit, toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const { ApplyEnum } = require('../utils/variables/enum');

const User = require('../models/user');
const Room = require('../models/room');

const createApply = async ({ user_id, study_id, message }) => {
  const createdRows = await applyDao.createApply({ user_id, study_id, message });
  if (createdRows.affectedRows === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
  push.emit('toHost', PushEventEnum.apply_new, study_id);
};

const getApplyByUser = async ({ study_id, user_id }) => {
  const applyData = await applyDao.getApplyByUser(study_id, user_id);
  if (applyData.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  return applyData[0];
};

const applyUpdate = async ({ id: user_id }, { apply_id }, updateData) => {
  const rows = await applyDao.applyUpdate(user_id, apply_id, updateData);
  if (rows.affectedRows === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
};

const applyDelete = async ({ id: user_id }, { apply_id }) => {
  const deleteRows = await applyDao.applyDelete(user_id, apply_id);
  if (deleteRows.affectedRows === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
};

const getApplyById = async ({ study_id, apply_id }) => {
  let applyData = await applyDao.getApplyById(study_id, apply_id);
  if (applyData.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  applyData = toBoolean(applyData, ['rejected_status']);
  return rowSplit(applyData, ['project']);
};

const applyListByHost = async ({ study_id }) => {
  const applyList = await applyDao.applyListByHost(study_id);
  if (applyList.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  return applyList;
};

const applyListByUser = async ({ id: user_id }) => {
  const applyList = await applyDao.applyListByUser(user_id);
  if (applyList.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  return applyList;
};

const applyProcess = async ({ study_id, apply_id }, { allow }) => {
  if (allow) {
    const userRows = await applyDao.getApplyById(study_id, apply_id);
    if (userRows.length === 0) {
      throw customError(404, '조회된 신청내역이 없습니다');
    }
    if (userRows[0].apply_status === ApplyEnum.allow) {
      throw customError(400, '이미 승인된 회원입니다');
    }
    const { user_id, nickname } = userRows[0];
    const allowRows = await applyDao.setAllow(study_id, apply_id, user_id);
    if (allowRows.affectedRows === 0) {
      throw customError(400, '수락 실패');
    }

    Room.updateOne({ study_id }, { $addToSet: { members: user_id } }).exec();
    User.updateOne({ user_id }, { $addToSet: { rooms: study_id } }).exec();

    broadcast.participate(study_id, nickname);
  } else {
    const rejectRows = await applyDao.setReject(apply_id);
    if (rejectRows.affectedRows === 0) {
      throw customError(404, '조회된 신청내역이 없습니다');
    }
  }
};

module.exports = {
  createApply,
  getApplyByUser,
  applyUpdate,
  applyDelete,
  getApplyById,
  applyListByHost,
  applyListByUser,
  applyProcess,
};
