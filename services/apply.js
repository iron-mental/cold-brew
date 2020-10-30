const applyDao = require('../dao/apply');

const { rowSplit, toBoolean } = require('../utils/query');

const createApply = async ({ study_id }, createData) => {
  createData.study_id = study_id;
  const newApply = await applyDao.createApply(createData);
  if (newApply.affectedRows === 0) {
    throw { status: 400, message: '스터디 신청에 실패했습니다' };
  }
};

const applyDetail = async ({ study_id, apply_id }) => {
  let applyRows = await applyDao.applyDetail(study_id, apply_id);
  if (applyRows.length === 0) {
    throw { status: 400, message: '조회 결과가 없습니다' };
  }
  applyRows = toBoolean(applyRows, ['rejected_status']);
  return rowSplit(applyRows, ['project']);
};

const applyUpdate = async ({ study_id, apply_id }, updateData) => {
  const updateRows = await applyDao.applyUpdate(study_id, apply_id, updateData);
  if (updateRows.affectedRows === 0) {
    throw { status: 400, message: '수정에 실패했습니다' };
  }
};

const applyDelete = async ({ study_id, apply_id }) => {
  const deleteRows = await applyDao.applyDelete(study_id, apply_id);
  if (deleteRows.affectedRows === 0) {
    throw { status: 400, message: '삭제에 실패했습니다' };
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
