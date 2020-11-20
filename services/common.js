const commonDao = require('../dao/common');
const { customError } = require('../utils/errors/customError');
const { authEnum } = require('../utils/variables/enums');

const isHost = async ({ id: user_id }, { study_id }) => {
  const checkRows = await commonDao.isHost(user_id, study_id);
  if (checkRows[0].isHost === 0) {
    throw customError(401, '권한이 없습니다');
  }
};

const checkAuth = async ({ id: user_id }, { study_id }) => {
  const memberCheckRows = await commonDao.checkMember(user_id, study_id);
  if (memberCheckRows.length === 1) {
    return authEnum[memberCheckRows[0].leader === 1 ? 'host' : 'member'];
  }

  const applyCheckRows = await commonDao.checkApply(user_id, study_id);
  if (applyCheckRows.length === 1) {
    return authEnum[applyCheckRows[0].apply_status === 0 ? 'applier' : 'rejected'];
  }

  return authEnum.none;
};

const checkAuthority = async ({ id: user_id }, { study_id }, ...authority) => {
  const status = await checkAuth({ id: user_id }, { study_id });
  if (authority.indexOf(status) === -1) {
    throw customError(401, '권한이 없습니다');
  }
};

module.exports = {
  isHost,
  checkAuth,
  checkAuthority,
};
