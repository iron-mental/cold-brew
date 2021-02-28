const reportDao = require('../dao/report');
const { customError } = require('../utils/errors/custom');

const createReport = async ({ id: user_id }, { study_id }, { message }) => {
  const reportRows = await reportDao.createReport({ study_id, user_id, message });
  if (reportRows.affectedRows === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
};

module.exports = {
  createReport,
};
