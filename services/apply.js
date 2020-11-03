const applyDao = require('../dao/apply');

const { rowSplit, toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/customError');

const createApply = async ({ study_id }, createData) => {
  createData.study_id = study_id;
  const newApply = await applyDao.createApply(createData);
  if (newApply.affectedRows === 0) {
    throw customError(400, '해당 id의 스터디가 없습니다');
  }
};

const applyDetail = async ({ study_id, apply_id }) => {
  let applyData = await applyDao.applyDetail(study_id, apply_id);
  if (applyData.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  applyData = toBoolean(applyData, ['rejected_status']);
  return rowSplit(applyData, ['project']);
};

const applyUpdate = async ({ study_id, apply_id }, updateData) => {
  const rows = await applyDao.applyUpdate(study_id, apply_id, updateData);
  if (rows.affectedRows === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
};

const applyDelete = async ({ study_id, apply_id }) => {
  const rows = await applyDao.applyDelete(study_id, apply_id);
  if (rows.affectedRows === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
