const alertDao = require('../dao/alert');
const { toBoolean } = require('../utils/query');

// 알림 조회
const getAlert = async ({ id: user_id }) => {
  const alertRows = await alertDao.getAlert(user_id);
  return toBoolean(alertRows, ['confirm']);
};

const confirmAlert = async ({ alert_id }) => {
  await alertDao.confirmAlert(alert_id);
};

module.exports = {
  getAlert,
  confirmAlert,
};
