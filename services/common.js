const commonDao = require('../dao/common');

const isHost = async ({ id: user_id }, { study_id }) => {
  const checkRows = await commonDao.isHost(user_id, study_id);
  if (checkRows[0].isHost === 0) {
    throw customError(401, '권한이 없습니다');
  }
};

module.exports = {
  isHost,
};
