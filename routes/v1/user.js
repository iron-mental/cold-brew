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
const alertValid = require('../../middlewares/validators/alert');
const alertController = require('../../controllers/alert');

const router = express.Router();

router.get('/check-nickname/:nickname', userValid.checkNickname, asyncWrap(userController.checkNickname));
router.get('/check-email/:email', userValid.checkEmail, asyncWrap(userController.checkEmail));
router.get('/address', asyncWrap(userController.getAddress));
router.get('/pushTest', asyncWrap(userController.pushTest));

router.post('/', userValid.signup, asyncWrap(userController.signup));
router.post('/login', userValid.login, asyncWrap(userController.login));
router.post('/logout', idCompare, userValid.logout, asyncWrap(userController.logout));
router.post('/reissuance', userValid.reissuance, asyncWrap(userController.reissuance));

router.get('/:id', userValid.userDetail, asyncWrap(userController.userDetail));
router.delete('/:id', idCompare, userValid.withdraw, asyncWrap(userController.withdraw));

router.put('/:id/info', idCompare, userValid.userInfoUpdate, asyncWrap(userController.userUpdate));
router.put('/:id/image', idCompare, imageUpload, userValid.userImageUpdate, asyncWrap(userController.userImageUpdate));
router.put('/:id/career', idCompare, userValid.userCareerUpdate, asyncWrap(userController.userUpdate));
router.put('/:id/sns', idCompare, userValid.userSnsUpdate, asyncWrap(userController.userUpdate));
router.put('/:id/location', idCompare, userValid.userLocationUpdate, asyncWrap(userController.userUpdate));
router.put('/:id/email', idCompare, userValid.updateEmail, asyncWrap(userController.updateEmail));
router.put('/:id/push_token', idCompare, userValid.updatePushToken, asyncWrap(userController.updatePushToken));

router.get('/:id/emailVerify', idCompare, userValid.emailVerification, asyncWrap(userController.emailVerification));
router.get('/emailVerify-process/:email', userValid.emailVerificationProcess, asyncWrap(userController.emailVerificationProcess));
router.post('/reset-password/:email', userValid.resetPassword, asyncWrap(userController.resetPassword));

router.get('/:id/study', idCompare, studyValid.getMyStudy, asyncWrap(studyController.getMyStudy));

router.get('/:id/apply', idCompare, applyValid.applyListByUser, asyncWrap(applyController.applyListByUser));

router.get('/:id/project', projectValid.getProjectList, asyncWrap(projectController.getProjectList));
router.post('/:id/project', idCompare, projectValid.updateProject, asyncWrap(projectController.updateProject));

router.get('/:id/alert', idCompare, alertValid.getAlert, asyncWrap(alertController.getAlert));
router.get('/:id/alert/:alert_id', idCompare, alertValid.confirmAlert, asyncWrap(alertController.confirmAlert));

module.exports = router;
