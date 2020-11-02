const noticeDao = require('../dao/notice');

const { customError } = require('../utils/errors/customError');

const createNotice = async ({ study_id }, createData) => {
  createData.study_id = study_id;
  const newNotice = await noticeDao.createNotice(createData);
  if (newNotice.affectedRows === 0) {
    throw customError(400, '해당 id의 스터디가 없습니다');
  }
};

const noticeDetail = async ({ study_id, notice_id }) => {
  const noticeData = await noticeDao.getNotice(study_id, notice_id);
  if (noticeData.length === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
  return noticeData[0];
};

const noticeUpdate = async ({ study_id, notice_id }, updateData) => {
  const rows = await noticeDao.noticeUpdate(study_id, notice_id, updateData);
  if (rows.affectedRows === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
};

const noticeDelete = async ({ study_id, notice_id }) => {
  const rows = await noticeDao.noticeDelete(study_id, notice_id);
  if (rows.affectedRows === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
