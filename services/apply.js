const applyDao = require('../dao/apply');

const { rowSplit, toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/customError');

const createApply = async (createData) => {
  const newApply = await applyDao.createApply(createData);
  if (newApply.affectedRows === 0) {
    throw customError(400, '해당 id의 스터디가 없습니다');
  }
};

const getApplyByUser = async ({ study_id, user_id }) => {
  let applyData = await applyDao.getApplyByUser(study_id, user_id);
  if (applyData.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  applyData = toBoolean(applyData, ['rejected_status']);
  return rowSplit(applyData, ['project']);
};

const applyUpdate = async ({ id: user_id }, { apply_id }, updateData) => {
  const rows = await applyDao.applyUpdate(user_id, apply_id, updateData);
  if (rows.affectedRows === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
};

const applyDelete = async ({ id: user_id }, { apply_id }) => {
  const rows = await applyDao.applyDelete(user_id, apply_id);
  if (rows.affectedRows === 0) {
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

const applyList = async ({ study_id }) => {
  let applyList = await applyDao.getApplyList(study_id);
  if (applyList.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  return applyList;
};

const applyProcess = async ({ study_id, apply_id }, { status }) => {
  if (status === 'allow') {
    const userRows = await applyDao.getApplyById(study_id, apply_id);
    const allowRows = await applyDao.setAllow(study_id, apply_id, userRows[0].user_id);
    if (allowRows.affectedRows === 0) {
      throw customError(404, '조회된 신청내역이 없습니다');
    }
    return '수락';
  }
  if (status === 'reject') {
    const rejectRows = await applyDao.setReject(apply_id);
    if (rejectRows.affectedRows === 0) {
      throw customError(404, '조회된 신청내역이 없습니다');
    }
    return '거절';
  }
  throw customError(400, '처리상태를 잘못 입력했습니다');
};

module.exports = {
  createApply,
  getApplyByUser,
  applyUpdate,
  applyDelete,
  getApplyById,
  applyList,
  applyProcess,
};
