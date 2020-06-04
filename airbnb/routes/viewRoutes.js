const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.route('/').get(viewController.getbase);
router.route('/signup').get(viewController.signup);
router.route('/login').get(viewController.login);
router.route('/overview').get(viewController.overview);
router.route('/host').get(viewController.postHost);

module.exports = router;
