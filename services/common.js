const commonDao = require('../dao/common');

const statusEnum = Object.freeze({
  host: 1,
  member: 2,
  apply: 3,
  rejected: 4,
  none: 5,
});

const isHost = async ({ id: user_id }, { study_id }) => {
  const checkRows = await commonDao.isHost(user_id, study_id);
  if (checkRows[0].isHost === 0) {
    throw customError(401, '권한이 없습니다');
  }
};

const checkMember = async ({ id: user_id }, { study_id }) => {
  const memberCheckRows = await commonDao.checkMember(user_id, study_id);
  if (memberCheckRows.length === 1) {
    if (memberCheckRows[0].leader === 1) {
      return statusEnum.host;
    } else {
      return statusEnum.member;
    }
  }

  const applyCheckRows = await commonDao.checkApply(user_id, study_id);
  if (applyCheckRows.length === 1) {
    if (applyCheckRows[0].rejected_status === 0) {
      return statusEnum.apply;
    } else {
      return statusEnum.rejected;
    }
  }
  return statusEnum.none;
};

module.exports = {
  isHost,
  checkMember,
};
