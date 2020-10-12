const { format } = require('date-fns');

const noticeDao = require('../dao/notice');

const createNotice = async ({ study_id }, createData) => {
  createData.study_id = study_id;
  const newNotice = await noticeDao.createNotice(createData);
  if (newNotice.affectedRows === 0) {
    throw { status: 400, message: '공지사항 작성에 실패했습니다' };
  }
};

const noticeDetail = async ({ study_id, notice_id }) => {
  const noticeData = await noticeDao.noticeDetail(study_id, notice_id);
  if (noticeData.length === 0) {
    throw { status: 400, message: '조회 결과가 없습니다' };
  }
  noticeData[0].created_at = format(noticeData[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  noticeData[0].updated_at = format(noticeData[0].updated_at, 'yyyy-MM-dd HH:mm:ss');
  return noticeData;
};

const noticeUpdate = async ({ study_id, notice_id }, updateData) => {
  const rows = await noticeDao.noticeUpdate(study_id, notice_id, updateData);
  if (rows.affectedRows === 0) {
    throw { status: 400, message: '공지사항 수정에 실패했습니다' };
  }
};

const noticeDelete = async ({ study_id, notice_id }) => {
  const rows = await noticeDao.noticeDelete(study_id, notice_id);
  if (rows.affectedRows === 0) {
    throw { status: 400, message: '삭제에 실패했습니다' };
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
