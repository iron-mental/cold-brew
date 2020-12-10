const commonDao = require('../dao/common');
const { authError } = require('../utils/errors/auth');
const { authEnum, applyEnum } = require('../utils/variables/enum');

const isHost = async ({ id: user_id }, { study_id }) => {
  const checkRows = await commonDao.isHost(user_id, study_id);
  if (checkRows[0].isHost === 0) {
    throw authError({ message: 'permission error' });
  }
};

const checkAuth = async ({ id: user_id }, { study_id }) => {
  const memberCheckRows = await commonDao.checkMember(user_id, study_id);
  if (memberCheckRows.length === 1) {
    return authEnum[memberCheckRows[0].leader == true ? authEnum.host : authEnum.member];
  }

  const applyCheckRows = await commonDao.checkApply(user_id, study_id);
  if (applyCheckRows.length === 1) {
    return authEnum[applyCheckRows[0].apply_status === applyEnum.apply ? authEnum.applier : authEnum.reject];
  }

  return authEnum.none;
};

const checkAuthority = async ({ id: user_id }, { study_id }, ...authority) => {
  const status = await checkAuth({ id: user_id }, { study_id });
  if (authority.indexOf(status) === -1) {
    throw authError({ message: 'permission error' });
  }
  return status;
};

module.exports = {
  isHost,
  checkAuth,
  checkAuthority,
};
