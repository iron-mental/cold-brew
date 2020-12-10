const studyService = require('../services/study');
const { isHost, checkAuth, checkAuthority } = require('../services/common');
const { authEnum } = require('../utils/variables/enum');
const response = require('../utils/response');

const createStudy = async (req, res) => {
  const study_id = await studyService.createStudy(req.user, req.body);
  response(res, 201, { study_id });
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

const studyDelete = async (req, res) => {
  await isHost(req.user, req.params);
  await studyService.studyDelete(req.user, req.params);
  response(res, 200, '스터디 삭제 완료');
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

  const studyList = await studyService.studyPaging(req.user, studyKeys);
  response(res, 200, studyList);
};

const leaveStudy = async (req, res) => {
  const authority = await checkAuthority(req.user, req.params, authEnum.host, authEnum.member);
  await studyService.leaveStudy(req.user, req.params, authority);
  response(res, 200, '탈퇴 완료');
};

const delegate = async (req, res) => {
  await isHost(req.user, req.params);
  await studyService.delegate(req.user, req.params, req.body);
  response(res, 200, '위임 완료');
};

const search = async (req, res) => {
  const studyList = await studyService.search(req.user, req.query);
  response(res, 200, studyList);
};

const ranking = async (req, res) => {
  const rankingList = await studyService.ranking();
  response(res, 200, rankingList);
};

module.exports = {
  createStudy,
  studyDetail,
  studyUpdate,
  studyDelete,
  myStudy,
  studyList,
  studyPaging,
  leaveStudy,
  delegate,
  search,
  ranking,
};
