const alertDao = require('../dao/alert');
const { toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/custom');

const getAlert = async ({ id: user_id }) => {
  const alertRows = await alertDao.getAlert(user_id);
  return toBoolean(alertRows, ['confirm']);
};

const confirmAlert = async ({ alert_id }) => {
  const confirmRows = await alertDao.confirmAlert(alert_id);
  if (confirmRows.affectedRows === 0) {
    throw customError(404, '알림을 찾을 수 없습니다');
  }
};

module.exports = {
  getAlert,
  confirmAlert,
};
