const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const studyDao = require('../dao/study');

// 스터디 생성
const createStudy = async (createData, filePath) => {
  const { user_id } = createData;
  delete createData.user_id;
  try {
    await studyDao.createStudy(user_id, createData);
  } catch (err) {
    fs.unlink(filePath, (err) => {});
    throw err;
  }
};

const studyDetail = async ({ study_id }) => {
  const [studyData] = await studyDao.getStudy(study_id);
  if (!studyData) {
    throw { status: 404, message: '조회된 스터디가 없습니다' };
  }
  studyData.notice = await studyDao.getNoticeList(study_id);
  studyData.participate = await studyDao.getParticipateList(study_id);

  // 권한확인 -> 나중에 jwt 도입 후 인증처리할것 (dao자체는 잘 작동함)
  // if (user_id === studyData.leader) {
  // studyData.apply = await studyDao.getApplyList(study_id);
  // }
  for (const item of studyData.notice) {
    item.created_at = format(item.created_at, 'yyyy-MM-dd HH:mm:ss');
  }
  return studyData;
};

const studyUpdate = async ({ study_id }, updateData, { destination, uploadedFile, path: _tmpPath }) => {
  try {
    const previousPath = await studyDao.getImage(study_id);
    const rows = await studyDao.studyUpdate(study_id, updateData);
    if (previousPath.length === 0 || rows.affectedRows === 0) {
      throw { status: 404, message: '조회된 스터디가 없습니다' };
    }
    const oldImagePath = path.join(destination, path.basename(previousPath[0].image));
    const newPath = path.join(destination, uploadedFile.basename);
    fs.rename(_tmpPath, newPath, (err) => {});
    fs.unlink(oldImagePath, (err) => {});
  } catch (err) {
    fs.unlink(_tmpPath, (err) => {}); // _tmp 파일 삭제
    throw err;
  }
};

module.exports = { createStudy, studyDetail, studyUpdate };
