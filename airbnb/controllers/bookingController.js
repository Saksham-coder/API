const Hotel = require('../models/hotelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');

exports.getCheckoutSession = async (req, res, next) => {
	// Get all the params
	console.log(req.query);
	// 1. Get the currently booked hotel
	// console.log('Hi from booking create session controller');
	// console.log(req.params);
	const hotel = await Hotel.findById(req.query.hotelId);
	console.log(hotel);
	// 2.Create checkout session'
	const session = await stripe.checkout.sessions.create({
		payment_method_types: [ 'card' ],
		success_url: `${req.protocol}://${req.get('host')}/?hotel=${req.query.hotelId}&user=${req.user.id}&checkin=${req
			.query.checkin}&checkout=${req.query.checkout}&guest=${req.query.guest}&price={req.query.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}/overview/`,
		customer_email: req.user.email,
		client_reference_id: req.query.hotelId,
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
	// 3.Creare session as response
	res.status(200).json({
		status: 'success',
		session
	});
};

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
	// console.log('welcome to chekout jugaadu route ');
	// console.log(req.params);
	const { hotel, user, price, checkin, checkout, guest } = req.query;
	if (!hotel && !user && !price) return next();
	await Booking.create({ hotel, user, price, checkin, checkout, guest });
	res.redirect(req.originalUrl.split('?')[0]);
});
