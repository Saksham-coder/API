const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.get('/me', authController.protect, userController.getMe, userController.getUser);

router.route('/logout').get(authController.logout);
router.patch('/updateMeHost', authController.isLoggedIn, userController.updateMeHost);
router.patch('/updatePassword', authController.isLoggedIn, authController.updatePassword);
router.patch(
	'/updatePersonal',
	authController.isLoggedIn,
	userController.uploadUserPhoto,
	userController.updatePersonal
);

module.exports = router;
