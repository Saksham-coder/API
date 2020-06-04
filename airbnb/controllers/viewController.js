const deleteKey = require("object-delete-key");
const user = require('../models/userModel');
const Hotel = require('../models/hotelModel');

exports.getbase = (req, res) => {
	res.status(200).render('base');
};

exports.login = (req, res) => {
	res.status(200).render('login');
};

exports.signup = (req, res) => {
	res.status(200).render('signup');
};

exports.overview = async (req, res) => {
	console.log(req.query);

	const queryObj = { ...req.query };
	console.log(queryObj);
	for (var i in queryObj){
		if(typeof(queryObj[i]) === 'object'){
		  for (var j in queryObj[i]){
			if (queryObj[i][j] === ''){
			  delete queryObj[i][j]
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

	query = query.skip(skip).limit(limit);

	if (req.query.page) {
		const numHotels = await Hotel.countDocuments();
		if (skip >= numHotels) throw new Error('This page does not exist');
	}

	// { price: { gte: '300' }, sort: '-1' } { price: { $gte: '300' } }
	// { price: { gte: '300' }, sort: '-1' } { price: { gte: '300' } }

	// 2. EXECUTE QUERY
	const hotels = await query;

	res.status(200).render('overview', {
		data: hotels
	});
};

exports.postHost = (req, res) =>{
	res.status(200).render('host');
}