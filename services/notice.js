const { format } = require('date-fns');

const noticeDao = require('../dao/notice');

const createNotice = async ({ studyId }, createData) => {
  createData.studyId = studyId;
  const newNotice = await noticeDao.createNotice(createData);
  if (newNotice.affectedRows === 0) {
    throw { status: 400, message: '공지사항 작성에 실패했습니다' };
  }
};

const noticeDetail = async ({ studyId, noticeId }) => {
  const noticeData = await noticeDao.noticeDetail(studyId, noticeId);
  if (noticeData.length === 0) {
    throw { status: 400, message: '조회 결과가 없습니다' };
  }
  for (const item of noticeData) {
    item.createdAt = format(item.createdAt, 'yyyy-MM-dd HH:mm:ss');
    item.updatedAt = format(item.updatedAt, 'yyyy-MM-dd HH:mm:ss');
  }
  return noticeData;
};

const noticeUpdate = async ({ studyId, noticeId }, updateData) => {
  const rows = await noticeDao.noticeUpdate(studyId, noticeId, updateData);
  if (rows.affectedRows === 0) {
    throw { status: 400, message: '공지사항 작성에 실패했습니다' };
  }
};

const noticeDelete = async ({ studyId, noticeId }) => {
  const rows = await noticeDao.noticeDelete(studyId, noticeId);
  if (rows.length === 0) {
    throw { status: 400, message: '삭제에 실패했습니다' };
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete
};
