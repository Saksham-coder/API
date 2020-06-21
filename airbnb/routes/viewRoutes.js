const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.route('/').get(authController.isLoggedIn, viewController.getbase);
router.route('/signup').get(viewController.signup);
router.route('/login').get(viewController.login);

router.route('/forgetPassword').get(viewController.forgetPassword);
router.route('/popupform').get(viewController.getpopupform);

router.route('/overview').get(authController.isLoggedIn, viewController.overview);
router.route('/overview/:id').get(authController.isLoggedIn, viewController.getHotel);

router.route('/me/host').get(authController.isLoggedIn, viewController.postHost);
router.route('/me').get(authController.isLoggedIn, viewController.getAccount);
router.route('/me/login-security').get(authController.isLoggedIn, viewController.getSecurity);
router.route('/me/personal').get(authController.isLoggedIn, viewController.getPersonal);

module.exports = router;
