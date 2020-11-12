const fs = require('fs');
const path = require('path');

const studyDao = require('../dao/study');
const { rowSplit, toBoolean, locationMerge, cutId, customSorting } = require('../utils/query');
const { customError } = require('../utils/errors/customError');

// 스터디 생성
const createStudy = async (createData) => {
  const { user_id } = createData;
  delete createData.user_id;
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

const studyList = async ({ category, sort }) => {
  let studyListRows = '';
  if (sort === 'new') {
    studyListRows = await studyDao.getStudyListByNew(category);
  } else if (sort === 'length') {
    studyListRows = await studyDao.getStudyListByLength(category);
    studyListRows = customSorting(studyListRows);
  } else {
    throw customError(404, 'sort 입력이 잘못되었습니다');
  }

  if (studyListRows.length === 0) {
    throw customError(404, '해당 카테고리에 스터디가 없습니다');
  }
  return cutId(studyListRows);
};

const studyPaging = async (studyKeys) => {
  const studyList = await studyDao.studyPaging(studyKeys);
  return studyList;
};

module.exports = {
  createStudy,
  studyDetail,
  studyUpdate,
  myStudy,
  studyList,
  studyPaging,
};
