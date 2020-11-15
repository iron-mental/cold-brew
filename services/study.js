const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');
const { getUserLocation } = require('../dao/common');
const { rowSplit, toBoolean, locationMerge, cutId, customSorting } = require('../utils/query');
const { customError } = require('../utils/errors/customError');

const createStudy = async ({ id: user_id }, createData) => {
  await studyDao.createStudy(user_id, createData);
};

const studyDetail = async ({ study_id }) => {
  let studyRows = await studyDao.getStudy(study_id);
  if (studyRows.length === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
  studyRows = toBoolean(studyRows, ['Pleader']);
  studyRows = rowSplit(studyRows, ['participate']);
  return locationMerge(studyRows);
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

const studyList = async ({ id: user_id }, { category, sort }) => {
  let studyListRows = '';
  if (sort === 'length') {
    const userData = await getUserLocation(user_id);
    studyListRows = await studyDao.getStudyListByLength(userData[0], category);
    studyListRows = customSorting(userData[0].sigungu, studyListRows);
  } else if (sort === 'new') {
    studyListRows = await studyDao.getStudyListByNew(category);
  } else {
    throw customError(404, 'sort 입력이 잘못되었습니다');
  }

  if (studyListRows.length === 0) {
    throw customError(404, '해당 카테고리에 스터디가 없습니다');
  }

  return cutId(studyListRows);
};

const studyPaging = async (studyKeys) => {
  return await studyDao.studyPaging(studyKeys);
};

module.exports = {
  createStudy,
  studyDetail,
  studyUpdate,
  myStudy,
  studyList,
  studyPaging,
};
