const adminDao = require('../dao/admin');

const { authError } = require('../utils/errors/auth');
const { customError } = require('../utils/errors/custom');
const { RedisEventEnum } = require('../utils/variables/enum');
const { redisTrigger, getUser } = require('./redis');

const resetRedis = async () => {
  let study_list = [];
  const userRows = await adminDao.getUserList();

  await userRows.forEach(async (user) => {
    study_list = await adminDao.getUserStudyList(user.id);
    await redisTrigger(user.id, RedisEventEnum.reset, study_list);
  });
};

const getRedis = async ({ user_id }) => {
  return await getUser(user_id);
};

const deleteEmptyStudy = async () => {
  await adminDao.deleteEmptyStudy();
};

const setVersion = async (versionData) => {
  const versionRows = await adminDao.setVersion(versionData);
  if (versionRows.affectedRows === 0) {
    throw customError(400, '버전 설정에 실패했습니다');
  }
};

module.exports = {
  resetRedis,
  getRedis,
  deleteEmptyStudy,
  setVersion,
};
