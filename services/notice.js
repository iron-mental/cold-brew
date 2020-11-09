const noticeDao = require('../dao/notice');

const { toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/customError');

const createNotice = async ({ study_id }, createData) => {
  createData.study_id = study_id;
  const newNotice = await noticeDao.createNotice(createData);
  if (newNotice.affectedRows === 0) {
    throw customError(400, '해당 id의 스터디가 없습니다');
  }
};

const noticeDetail = async ({ study_id, notice_id }) => {
  let noticeRows = await noticeDao.getNotice(study_id, notice_id);
  if (noticeRows.length === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
  noticeRows = toBoolean(noticeRows, ['pinned']);
  return noticeRows[0];
};

const noticeUpdate = async ({ study_id, notice_id }, updateData) => {
  const updateRows = await noticeDao.noticeUpdate(study_id, notice_id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
};

const noticeDelete = async ({ study_id, notice_id }) => {
  const deleteRows = await noticeDao.noticeDelete(study_id, notice_id);
  if (deleteRows.affectedRows === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
};

const noticeList = async ({ study_id }) => {
  let noticeRows = await noticeDao.getNoticeList(study_id);
  if (noticeRows.length === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
  noticeRows = toBoolean(noticeRows, ['pinned']);
  return noticeRows;
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
  noticeList,
};
