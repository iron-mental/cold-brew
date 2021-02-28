const applyService = require('../services/apply');
const { isHost, checkAuthority } = require('../services/common');
const { AuthEnum } = require('../utils/variables/enum');
const response = require('../utils/response');

const createApply = async (req, res) => {
  await checkAuthority(req.user, req.params, AuthEnum.none, AuthEnum.reject);
  req.body.user_id = req.user.id;
  req.body.study_id = req.params.study_id;
  await applyService.createApply(req.body);
  response(res, 201, '가입신청이 완료되었습니다');
};

const applyUpdate = async (req, res) => {
  await applyService.applyUpdate(req.user, req.params, req.body);
  response(res, 200, '가입신청이 수정되었습니다');
};

const applyDelete = async (req, res) => {
  await checkAuthority(req.user, req.params, AuthEnum.applier);
  await applyService.applyDelete(req.user, req.params);
  response(res, 200, '가입신청이 취소되었습니다');
};

const getApplyByUser = async (req, res) => {
  const applyData = await applyService.getApplyByUser(req.params);
  response(res, 200, applyData);
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
  response(res, 200, '처리가 완료되었습니다');
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
