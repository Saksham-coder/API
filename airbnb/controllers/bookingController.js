const Hotel = require('../models/hotelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');

exports.getCheckoutSession = async (req, res, next) => {
	// 1. get the currently booked hotel
	// console.log('Hi from booking create session controller');
	// console.log(req.params);
	const hotel = await Hotel.findById(req.params.hotelId);
	// console.log(hotel);
	// Create checkout session'
	const session = await stripe.checkout.sessions.create({
		payment_method_types: [ 'card' ],
		success_url: `${req.protocol}://${req.get('host')}/?hotel=${req.params.hotelId}&user=${req.user
			.id}&price=${hotel.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}/overview/`,
		customer_email: req.user.email,
		client_reference_id: req.params.hotelId,
		line_items: [
			{
				name: `${hotel.name} Hotel`,
				description: hotel.summary,
				images: [ `www.pexels.com/photo/man-covering-face-with-frame-2017802/` ],
				amount: hotel.price * 100,
				currency: 'INR',
				quantity: 1
			}
		]
	});
	// console.log('giving session for checking');
	console.log(session);
	// Creare session as response
	res.status(200).json({
		status: 'success',
		session
	});
};

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
	// console.log('welcome to chekout jugaadu route ');
	// console.log(req.params);
	const { hotel, user, price } = req.query;
	if (!hotel && !user && !price) return next();
	await Booking.create({ hotel, user, price });

	res.redirect(req.originalUrl.split('?')[0]);
});
