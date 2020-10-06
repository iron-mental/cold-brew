const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');

// 스터디 생성
const createStudy = async (createData, filePath) => {
  const { userId } = createData;
  delete createData.userId;
  const newStudy = await studyDao.createStudy(userId, createData, filePath);
  if (!newStudy.affectedRows) {
    throw { status: 400, message: 'no result' };
  }
  return newStudy;
};

const studyDetail = async ({ studyId }) => {
  const rows = await studyDao.studyDetail(studyId);
  if (!rows.title) {
    throw { status: 404, message: '조회된 스터디가 없습니다' };
  }
  return rows;
};

const studyUpdate = async ({ studyId }, updateData, { destination, uploadedFile, _tmpPath }) => {
  const rows = await studyDao.studyUpdate(studyId, updateData, _tmpPath);
  if (!rows[0].affectedRows) {
    fs.unlink(_tmpPath, err => {}); // _tmp 파일 삭제
    throw { status: 404, message: '조회된 스터디가 없습니다' };
  }
  // _tmp -> basename 덮어쓰기, 기존 이미지 삭제
  const newPath = path.join(destination, uploadedFile.basename);
  const previousPath = path.join(destination, path.basename(rows[1]));
  fs.rename(_tmpPath, newPath, err => {});
  fs.unlink(previousPath, err => {});
};

module.exports = { createStudy, studyDetail, studyUpdate };
