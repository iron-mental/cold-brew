const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');
const { rowSplit } = require('../utils/database');
const { customError } = require('../utils/errors/customError');

// 스터디 생성
const createStudy = async (createData, filePath) => {
  const { user_id } = createData;
  delete createData.user_id;
  await studyDao.createStudy(user_id, createData);
};

const studyDetail = async ({ study_id }) => {
  const studyData = await studyDao.getStudy(study_id);
  if (!studyData) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
  // 권한확인 -> 나중에 jwt 도입 후 인증처리할것 (dao자체는 잘 작동함)
  // if (user_id === studyData.leader) {
  // studyData.apply = await studyDao.getApplyList(study_id);
  // }
  return rowSplit(studyData, ['participate', 'notice']);
};

const studyUpdate = async ({ study_id }, updateData, filedata) => {
  if (filedata) {
    const { destination, uploadedFile, path: _tmpPath } = filedata;
    const previousPath = await studyDao.getImage(study_id);
    const updateRows = await studyDao.studyUpdate(study_id, updateData);
    if (previousPath.length === 0 || updateRows.affectedRows === 0) {
      throw customError(404, '조회된 스터디가 없습니다');
    }

    const oldImagePath = path.join(destination, path.basename(previousPath[0].image));
    const newPath = path.join(destination, uploadedFile.basename);
    fs.rename(_tmpPath, newPath, (err) => {});
    fs.unlink(oldImagePath, (err) => {});
  } else {
    const updateRows = await studyDao.studyUpdate(study_id, updateData);
    if (updateRows.affectedRows === 0) {
      throw customError(404, '조회된 스터디가 없습니다');
    }
  }
};

const myStudy = async ({ id }) => {
  const myStudyList = await studyDao.getMyStudy(id);
  if (myStudyList.length === 0) {
    throw customError(404, '가입한 스터디가 없습니다');
  }
  return myStudyList;
};

const studyList = async ({ category, sort }) => {
  let data = '';
  if (sort === 'new') {
    data = await studyDao.getStudyListByNew(category);
  } else if (sort === 'length') {
    // data = await studyDao.getStudyListByLength(category);
  } else {
    throw customError(404, 'sort 입력이 잘못되었습니다');
  }
  if (data.length === 0) {
    throw customError(404, '해당 카테고리에 스터디가 없습니다');
  }
  return data;
};

module.exports = { createStudy, studyDetail, studyUpdate, myStudy, studyList };
