const Hotel = require('../models/hotelModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopHotel = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = 'price';
	req.query.fields = 'name,price,description,location';
	next();
};

exports.getAllHotel = catchAsync(async (req, res) => {
	// console.log(req.query);

	// BUILD QUERY
	// 1. FILTERING
	const queryObj = { ...req.query };
	const excludedFields = [ 'page', 'sort', 'limit', 'fields' ];
	excludedFields.forEach((el) => delete queryObj[el]);

	// console.log(req.query, queryObj);
	// 1.B ADVANCED FILTERING
	let queryStr = JSON.stringify(queryObj);
	queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

	// console.log(queryStr)
	// console.log(JSON.parse(queryStr))

	let query = Hotel.find(JSON.parse(queryStr));

	// console.log('total length of your query ' + query.length);

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

	query = query.skip(skip).limit(limit);

	if (req.query.page) {
		const numHotels = await Hotel.countDocuments();
		if (skip >= numHotels) throw new Error('This page does not exist');
	}

	// { price: { gte: '300' }, sort: '-1' } { price: { $gte: '300' } }
	// { price: { gte: '300' }, sort: '-1' } { price: { gte: '300' } }

	// 2. EXECUTE QUERY
	// const hotels = await query.explain();
	const hotels = await query;
	res.status(201).json({
		status: 'success',
		results: hotels.length,
		data: {
			data: hotels
		}
	});
});

exports.getHotel = catchAsync(async (req, res) => {
	// console.log(req.params)
	const oneHotel = await Hotel.findById(req.params.id).populate('reviews');
	// const oneHotel = await Hotel.findOne({name: req.params.name})
	// console.log('Fro one hotel conroller ');
	// console.log('searching one hotel');
	if (!oneHotel) {
		return next(new AppError('There is no hotel with that name', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: oneHotel
		}
	});
});

exports.updateHotel = async (req, res) => {
	try {
		// console.log(req.params)
		const oneHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		res.status(201).json({
			status: 'success',
			data: {
				data: oneHotel
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};

exports.createHotel = async (req, res) => {
	try {
		console.log(req.body);
		var parsedBody = { ...req.body };
		if (req.cookies.jwt) {
			// console.log('token is present in cookie and appending user id to hotel');
			let token = req.cookies.jwt;
			const decoded = await jwt.verify(token, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
			// console.log(decoded);
			id = decoded.id;
			// parsedBody.push({ host: id });
			parsedBody.host = id;
			if (req.body.longitude) {
				coordinate = {};
				// coordinates = [ req.body.longitude, req.body.latitude ];
				coordinate.coordinates = [ req.body.longitude, req.body.latitude ];
				coordinate.description = req.body.descript;
				coordinate.address = req.body.add;
				parsedBody.livelocation = coordinate;
			}
			console.log(parsedBody);
		}

		const newHotel = await Hotel.create(parsedBody);
		res.status(201).json({
			status: 'success',
			data: {
				data: newHotel
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};

exports.deleteHotel = async (req, res) => {
	try {
		await Hotel.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success'
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};
