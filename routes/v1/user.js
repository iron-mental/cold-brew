const express = require('express');

const { idCompare } = require('../../middlewares/auth');
const { imageUpload } = require('../../middlewares/file');
const asyncWrap = require('../../utils/errors/wrap');
const userValid = require('../../middlewares/validators/user');
const userController = require('../../controllers/user');
const studyValid = require('../../middlewares/validators/study');
const studyController = require('../../controllers/study');
const applyValid = require('../../middlewares/validators/apply');
const applyController = require('../../controllers/apply');
const projectValid = require('../../middlewares/validators/project');
const projectController = require('../../controllers/project');

const router = express.Router();

router.get('/check-nickname/:nickname', userValid.checkNickname, asyncWrap(userController.checkNickname)); // 닉네임 중복체크
router.get('/check-email/:email', userValid.checkEmail, asyncWrap(userController.checkEmail)); // 이메일 중복체크

router.post('/', userValid.signup, asyncWrap(userController.signup)); // 회원 가입
router.post('/login', userValid.login, asyncWrap(userController.login)); // 로그인
router.post('/reissuance', userValid.reissuance, asyncWrap(userController.reissuance)); // accessToken 재발급

router.get('/:id', userValid.userDetail, asyncWrap(userController.userDetail)); // 유저 상세조회
router.delete('/:id', idCompare, userValid.withdraw, asyncWrap(userController.withdraw)); // 회원 탈퇴

router.put('/:id/info', idCompare, userValid.userInfoUpdate, asyncWrap(userController.userUpdate)); // 닉네임, 소개 수정
router.put('/:id/image', idCompare, imageUpload, userValid.userImageUpdate, asyncWrap(userController.userUpdate)); // 이미지 수정
router.put('/:id/career', idCompare, userValid.userCareerUpdate, asyncWrap(userController.userUpdate)); // 경력 수정
router.put('/:id/sns', idCompare, userValid.userSnsUpdate, asyncWrap(userController.userUpdate)); // sns 수정
router.put('/:id/location', idCompare, userValid.userLocationUpdate, asyncWrap(userController.userUpdate)); // 지역정보 수정

router.get('/:id/emailVerify', idCompare, userValid.emailVerification, asyncWrap(userController.emailVerification)); // 이메일 인증 요청
router.get('/emailVerify-process/:email', userValid.emailVerificationProcess, asyncWrap(userController.emailVerificationProcess)); // 이메일 인증 요청

router.get('/:id/study', idCompare, studyValid.myStudy, asyncWrap(studyController.myStudy)); // 내 스터디 조회

router.get('/:id/apply', idCompare, applyValid.applyListByUser, asyncWrap(applyController.applyListByUser)); // 스터디 신청목록 조회

router.post('/:id/project', idCompare, projectValid.createProject, asyncWrap(projectController.createProject)); // 프로젝트 작성
router.get('/:id/project', projectValid.getProjectList, asyncWrap(projectController.getProjectList)); // 내 프로젝트 목록 조회
router.put('/:id/project/:project_id', idCompare, projectValid.updateProject, asyncWrap(projectController.updateProject)); // 프로젝트 수정
router.delete('/:id/project/:project_id', idCompare, projectValid.deleteProject, asyncWrap(projectController.deleteProject)); // 프로젝트 삭제

router.post('/reset-password/:email', userValid.resetPassword, asyncWrap(userController.resetPassword)); // 비밀번호 리셋 요청

module.exports = router;
