const express = require('express');
const hotelController = require('../controllers/hotelController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/top-5-cheap').get(hotelController.aliasTopHotel, hotelController.getAllHotel);

// router.use(authController.protect)

router.route('/').get(hotelController.getAllHotel).post(hotelController.createHotel);

router
	.route('/:id')
	.get(hotelController.getHotel)
	.patch(hotelController.updateHotel)
	.delete(hotelController.deleteHotel);

module.exports = router;
