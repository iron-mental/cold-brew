const { format } = require('date-fns');

const applyDao = require('../dao/apply');

const createApply = async ({ studyId }, createData) => {
  createData.studyId = studyId;
  const newApply = await applyDao.createApply(createData);
  if (newApply.affectedRows === 0) {
    throw { status: 400, message: '스터디 신청에 실패했습니다' };
  }
};

const applyDetail = async ({ studyId, applyId }) => {
  const applyData = await applyDao.applyDetail(studyId, applyId);
  if (applyData.length === 0) {
    throw { status: 400, message: '조회 결과가 없습니다' };
  }
  
  applyData[0].createdAt = format(applyData[0].createdAt, 'yyyy-MM-dd HH:mm:ss');
  // 정책 마련 후 rejectedAt도 수정
  
  return applyData;
};

const applyUpdate = async ({ studyId, applyId }, updateData) => {
  const rows = await applyDao.applyUpdate(studyId, applyId, updateData);
  if (rows.affectedRows === 0) {
    throw { status: 400, message: '수정에 실패했습니다' };
  }
};

const applyDelete = async ({ studyId, applyId }) => {
  const rows = await applyDao.applyDelete(studyId, applyId);
  if (rows.length === 0) {
    throw { status: 400, message: '삭제에 실패했습니다' };
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete
};