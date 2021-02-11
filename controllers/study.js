const studyService = require('../services/study');
const { isHost, checkAuth, checkAuthority } = require('../services/common');
const { AuthEnum } = require('../utils/variables/enum');
const response = require('../utils/response');

const createStudy = async (req, res) => {
  const study_id = await studyService.createStudy(req.user, req.body);
  response(res, 201, { study_id });
};

const studyDetail = async (req, res) => {
  const studyData = await studyService.studyDetail(req.user, req.params, req.query);
  studyData.Authority = await checkAuth(req.user, req.params);
  response(res, 200, studyData);
};

const studyUpdate = async (req, res) => {
  await isHost(req.user, req.params);
  await studyService.studyUpdate(req.params, req.body, req.file);
  response(res, 200, '스터디가 수정되었습니다');
};

const studyDelete = async (req, res) => {
  await isHost(req.user, req.params);
  await studyService.studyDelete(req.user, req.params);
  response(res, 200, '스터디가 삭제되었습니다');
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
  const studyList = await studyService.studyPaging(req.user, req.query);
  response(res, 200, studyList);
};

const leaveStudy = async (req, res) => {
  const authority = await checkAuthority(req.user, req.params, AuthEnum.host, AuthEnum.member);
  await studyService.leaveStudy(req.user, req.params, authority);
  response(res, 200, '탈퇴가 완료되었습니다');
};

const delegate = async (req, res) => {
  await isHost(req.user, req.params);
  await studyService.delegate(req.user, req.params, req.body);
  response(res, 200, '위임이 완료되었습니다');
};

const search = async (req, res) => {
  const studyList = await studyService.search(req.user, req.query);
  response(res, 200, studyList);
};

const ranking = async (req, res) => {
  const rankingList = await studyService.ranking();
  response(res, 200, rankingList);
};

const category = async (req, res) => {
  const categoryList = await studyService.category(req.user);
  response(res, 200, categoryList);
};

const getChatting = async (req, res) => {
  await checkAuthority(req.user, req.params, AuthEnum.host, AuthEnum.member);
  const chatting = await studyService.getChatting(req.params, req.query);
  response(res, 200, chatting);
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
  category,
  getChatting,
};
