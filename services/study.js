const studyDao = require('../dao/study');

// 스터디 생성
const createStudy = async createData => {
  const { userId } = createData;
  delete createData.userId;

  const newStudy = await studyDao.createStudy(userId, createData); // FB 가입
  if (!newStudy.affectedRows) {
    throw { status: 400, message: 'no result' };
  }
};

module.exports = { createStudy };
