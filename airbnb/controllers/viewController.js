const deleteKey = require('object-delete-key');
const user = require('../models/userModel');
const Hotel = require('../models/hotelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Bookings = require('../models/bookingModel');
const Booking = require('../models/bookingModel');

exports.getbase = (req, res) => {
	res.status(200).render('base');
};

exports.login = (req, res) => {
	res.status(200).render('login');
};

exports.forgetPassword = (req, res) => {
	res.status(200).render('login_forgetPassword');
};

exports.getpopupform = (req, res) => {
	res.status(200).render('login_popforgetPassword');
};

exports.signup = (req, res) => {
	res.status(200).render('signup');
};

exports.overview = async (req, res) => {
	// 1) Get hotel data from collection and also applying varous filters
	// console.log(req.query);

	const queryObj = { ...req.query };
	// console.log(queryObj);
	for (var i in queryObj) {
		if (typeof queryObj[i] === 'object') {
			for (var j in queryObj[i]) {
				if (queryObj[i][j] === '') {
					delete queryObj[i][j];
				}
			}
		}
	}
	for (var i in queryObj) {
		if (queryObj[i] === '' || Object.keys(queryObj[i]).length === 0) {
			delete queryObj[i];
		}
	}

	const excludedFields = [ 'page', 'sort', 'limit', 'fields', 'startdate', 'enddate' ];
	excludedFields.forEach((el) => delete queryObj[el]);

	// console.log(req.query, queryObj);
	// 1.B ADVANCED FILTERING
	let queryStr = JSON.stringify(queryObj);
	queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

	// console.log(queryStr)
	// console.log(JSON.parse(queryStr))

	let query = Hotel.find(JSON.parse(queryStr));

	// 2.SORTING
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// 3.FIELD LIMITING
	if (req.query.fields) {
		const fields = req.query.fields.split(',').join(' ');
		query = query.select(fields);
	} else {
		query = query.select('-__v');
	}

	// 4.PAGINATION
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 10;
	const skip = (page - 1) * limit;

	// console.log('total length of your query ' + (await query).length);
	const length = (await query).length;

	query = query.skip(skip).limit(limit);

	if (req.query.page) {
		const numHotels = await Hotel.countDocuments();
		if (skip >= numHotels) throw new Error('This page does not exist');
	}

	// { price: { gte: '300' }, sort: '-1' } { price: { $gte: '300' } }
	// { price: { gte: '300' }, sort: '-1' } { price: { gte: '300' } }

	// 2. EXECUTE QUERY
	const hotels = await query.populate('reviews');
	const location = req.query.location;

	res.status(200).render('overview', {
		data: hotels,
		location,
		page,
		length
	});
};

exports.getHotel = catchAsync(async (req, res) => {
	// 1) Get the data, for the requested hotel (including reviews and guides)
	// console.log(req.params)
	const oneHotel = await Hotel.findById(req.params.id).populate('reviews');
	// const oneHotel = await Hotel.findOne({name: req.params.name})
	// console.log(oneHotel);
	// console.log('Hi from one controller and checking error page');
	if (!oneHotel) {
		return next(new AppError('There is no Hotel with that name', 404));
	}

	res.render('singleOverview', {
		data: oneHotel
	});
});

exports.postHost = (req, res) => {
	res.status(200).render('host');
};

exports.getAccount = async (req, res) => {
	// console.log('hi froom rendering');
	// console.log(req.user);
	res.status(200).render('account', {
		title: 'Your Account'
	});
};

exports.getSecurity = async (req, res) => {
	// console.log('hi froom security view controller');
	// console.log(req.user);
	res.status(200).render('security', {
		title: 'Security'
	});
};

exports.getPersonal = async (req, res) => {
	// console.log('hi froom Personal view controller');
	// console.log(req.user);
	res.status(200).render('personal', {
		title: 'Personal Information'
	});
};

exports.getMyHotel = catchAsync(async (req, res, next) => {
	// 1.Find all the bookings
	// console.log('Hi from getting user booked hotel controller and displaying bokings');
	const hotels = await Booking.find({ user: req.user._id }).populate('bookings');
	// console.log(hotels);

	res.status(200).render('bookedHotels', {
		title: 'My Hotels',
		hotels
	});
});
