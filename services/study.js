const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const studyDao = require('../dao/study');

// 스터디 생성
const createStudy = async (createData, filePath) => {
  var { userId } = createData;
  delete createData.userId;
  try {
    await studyDao.createStudy(userId, createData, filePath);
  } catch (err) {
    fs.unlink(filePath, err => {});
    throw err;
  }
};

const studyDetail = async ({ studyId }) => {
  const [studyData] = await studyDao.getStudy(studyId);
  if (!studyData) {
    throw { status: 404, message: '조회된 스터디가 없습니다' };
  }
  studyData.notice = await studyDao.getNoticeList(studyId);
  studyData.participate = await studyDao.getParticipateList(studyId);

  // 권한확인 -> 나중에 jwt 도입 후 인증처리할것 (dao자체는 잘 작동함)
  // if (userId === studyData.leader) {
  // studyData.apply = await studyDao.getApplyList(studyId);
  // }
  for (const item of studyData.notice) {
    item.createdAt = format(item.createdAt, 'yyyy-MM-dd HH:mm:ss');
  }
  return studyData;
};

const studyUpdate = async ({ studyId }, updateData, { destination, uploadedFile, path: _tmpPath }) => {
  try {
    const previousPath = await studyDao.getImage(studyId);
    if (!previousPath.length) {
      throw { status: 404, message: '조회된 스터디가 없습니다' };
    }

    const rows = await studyDao.studyUpdate(studyId, updateData);
    if (!rows.affectedRows) {
      throw { status: 404, message: '조회된 스터디가 없습니다' };
    }

    const oldImagePath = path.join(destination, path.basename(previousPath[0].image));
    const newPath = path.join(destination, uploadedFile.basename);
    fs.rename(_tmpPath, newPath, err => {});
    fs.unlink(oldImagePath, err => {});
  } catch (err) {
    fs.unlink(_tmpPath, err => {}); // _tmp 파일 삭제
    throw err;
  }
};

module.exports = { createStudy, studyDetail, studyUpdate };
