const { format } = require('date-fns');

const noticeDao = require('../dao/notice');

const createNotice = async ({ studyId }, createData) => {
  createData.studyId = studyId;
  const newNotice = await noticeDao.createNotice(createData);
  if (!newNotice.affectedRows) {
    throw { status: 400, message: 'no result' };
  }
  return newNotice;
};

const noticeDetail = async ({ studyId, noticeId }, res) => {
  const noticeData = await noticeDao.noticeDetail(studyId, noticeId);
  if (!noticeData.length) {
    throw { status: 400, message: 'no result' };
  }
  for (const item of noticeData) {
    item.createdAt = format(item.createdAt, 'yyyy-MM-dd HH:mm:ss');
    item.updatedAt = format(item.updatedAt, 'yyyy-MM-dd HH:mm:ss');
  }
  return noticeData;
};

module.exports = {
  createNotice,
  noticeDetail,
};
