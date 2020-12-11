const applyService = require('../services/apply');
const { isHost, checkAuthority } = require('../services/common');
const { authEnum } = require('../utils/variables/enums');
const response = require('../utils/response');

const createApply = async (req, res) => {
  await checkAuthority(req.user, req.params, authEnum.none);
  req.body.user_id = req.user.id;
  req.body.study_id = req.params.study_id;
  await applyService.createApply(req.body);
  response(res, 201, '가입신청 완료');
};

const getApplyByUser = async (req, res) => {
  const applyData = await applyService.getApplyByUser(req.params);
  response(res, 200, applyData);
};

const applyUpdate = async (req, res) => {
  await checkAuthority(req.user, req.params, authEnum.applier);
  await applyService.applyUpdate(req.user, req.params, req.body);
  response(res, 204, '가입신청 수정');
};

const applyDelete = async (req, res) => {
  await checkAuthority(req.user, req.params, authEnum.applier);
  await applyService.applyDelete(req.user, req.params);
  response(res, 204, '가입신청 취소');
};

const getApplyById = async (req, res) => {
  await isHost(req.user, req.params);
  const applyData = await applyService.getApplyById(req.params);
  response(res, 200, applyData);
};

const applyListByHost = async (req, res) => {
  await isHost(req.user, req.params);
  const applyList = await applyService.applyListByHost(req.params);
  response(res, 200, applyList);
};

const applyListByUser = async (req, res) => {
  const applyList = await applyService.applyListByUser(req.params);
  response(res, 200, applyList);
};

const applyProcess = async (req, res) => {
  await isHost(req.user, req.params);
  await applyService.applyProcess(req.params, req.body);
  response(res, 204, '처리 완료');
};

module.exports = {
  createApply,
  getApplyByUser,
  applyUpdate,
  applyDelete,
  getApplyById,
  applyListByHost,
  applyListByUser,
  applyProcess,
};
