const commonDao = require('../dao/common');
const { customError } = require('../utils/errors/customError');

const authEnum = Object.freeze({
  host: 1,
  member: 2,
  apply: 3,
  rejected: 4,
  none: 5,
  1: 'host',
  2: 'member',
  3: 'apply',
  4: 'rejected',
  5: 'none',
});

const isHost = async ({ id: user_id }, { study_id }) => {
  const checkRows = await commonDao.isHost(user_id, study_id);
  if (checkRows[0].isHost === 0) {
    throw customError(401, '권한이 없습니다');
  }
};

const checkAuth = async ({ id: user_id }, { study_id }) => {
  const memberCheckRows = await commonDao.checkMember(user_id, study_id);
  if (memberCheckRows.length === 1) {
    if (memberCheckRows[0].leader === 1) {
      return authEnum.host;
    } else {
      return authEnum.member;
    }
  }

  const applyCheckRows = await commonDao.checkApply(user_id, study_id);
  if (applyCheckRows.length === 1) {
    if (applyCheckRows[0].rejected_status === 0) {
      return authEnum.apply;
    } else {
      return authEnum.rejected;
    }
  }
  return authEnum.none;
};

const checkAuthority = async ({ id: user_id }, { study_id }, ...levels) => {
  const statusNumber = await checkAuth({ id: user_id }, { study_id });
  const status = authEnum[statusNumber];
  if (levels.indexOf(status) === -1) {
    throw customError(401, '권한이 없습니다');
  }
};

module.exports = {
  isHost,
  checkAuth,
  checkAuthority,
};
