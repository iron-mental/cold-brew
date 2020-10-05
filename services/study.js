const studyDao = require('../dao/study');

// 스터디 생성
const createStudy = async createData => {
  const { userId } = createData;
  delete createData.userId;
  const newStudy = await studyDao.createStudy(userId, createData);
  if (!newStudy.affectedRows) {
    throw { status: 400, message: 'no result' };
  }
};

const studyDetail = async ({ id }) => {
  const rows = await studyDao.studyDetail(id);
  if (!rows.title) {
    throw { status: 404, message: '조회된 스터디가 없습니다' };
  }
  return rows;
};

module.exports = { createStudy, studyDetail };
