const adminDao = require('../dao/admin');
const { authError } = require('../utils/errors/auth');
const { RedisEventEnum } = require('../utils/variables/enum');
const { redisTrigger, getUser } = require('./redis');

// 레디스 초기화
const resetRedis = async ({ id: user_id }) => {
  if (user_id !== 1) {
    throw authError({ message: 'permission error' });
  }
  let study_list = [];
  const userRows = await adminDao.getUserList();

  await userRows.forEach(async (user) => {
    study_list = await adminDao.getUserStudyList(user.id);
    await redisTrigger(user.id, RedisEventEnum.reset, study_list);
  });
};

const getRedis = async ({ id }, { user_id }) => {
  if (id !== 1) {
    throw authError({ message: 'permission error' });
  }
  return await getUser(user_id);
};

module.exports = {
  resetRedis,
  getRedis,
};
