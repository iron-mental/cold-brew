const studyService = require('../services/study');
const { isHost, checkAuth } = require('../services/common');
const response = require('../utils/response');

const createStudy = async (req, res) => {
  await studyService.createStudy(req.user, req.body);
  response(res, 201, '스터디 생성 완료');
};

const studyDetail = async (req, res) => {
  const studyData = await studyService.studyDetail(req.params);
  studyData.Authority = await checkAuth(req.user, req.params);
  response(res, 200, studyData);
};

const studyUpdate = async (req, res) => {
  await isHost(req.user, req.params);
  await studyService.studyUpdate(req.params, req.body, req.file);
  response(res, 200, '스터디 수정 완료');
};

const myStudy = async (req, res) => {
  const studyList = await studyService.myStudy(req.params);
  response(res, 200, studyList);
};

const studyList = async (req, res) => {
  const studyList = await studyService.studyList(req.user, req.query);

  response(res, 200, studyList);
};

const studyPaging = async (req, res) => {
  const studyKeys = Array.from({ length: 10 });
  for (const [key, value] of Object.entries(req.query.values.split(','))) {
    studyKeys[key] = value;
  }

  const studyList = await studyService.studyPaging(studyKeys);
  response(res, 200, studyList);
};

module.exports = {
  createStudy,
  studyDetail,
  studyUpdate,
  myStudy,
  studyList,
  studyPaging,
};
