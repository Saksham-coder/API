const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res) => {
	console.log('From auth' + req.body);
	const newUser = await user.create(req.body);

	id = newUser._id;

	const token = jwt.sign({ id }, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	const cookieOptions = {
		expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	console.log(token);
	res.cookie('jwt', token, cookieOptions);

	res.status(201).json({
		status: 'success',
		token: token,
		data: newUser
	});
});

exports.login = catchAsync(async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	// console.log(req.body)
	// console.log(username, password)
	if (!email || !password) throw new err('Please provide username or password');
	const singleUser = await user.findOne({ email: email });
	// console.log(singleUser)
	const correct = await bcrypt.compare(password, singleUser.password);

	if (!singleUser || !correct) throw new err('Please provide valid username or password');

	id = singleUser._id;
	const token = jwt.sign({ id }, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	console.log(token);
	const cookieOptions = {
		expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	res.cookie('jwt', token, cookieOptions);
	res.status(200).json({
		status: 'success',
		token: token
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and check of it's there
	console.log('Welcome to protected route');
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	console.log(token);
	if (!token) {
		return next(new AppError('You are not logged in! Please log in to get access.', 401));
	}

	// 2) Verification token
	const decoded = await jwt.verify(token, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	console.log(decoded);
	// 3) Check if user still exists
	const currentUser = await user.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to this token does no longer exist.', 401));
	}

	// 4) Check if user changed password after the token was issued
	// // if (currentUser.changedPasswordAfter(decoded.iat)) {
	// //   return next(
	// // 	new AppError('User recently changed password! Please log in again.', 401)
	// //   );
	// }
	console.log('giving current user from protected user');
	console.log(currentUser);
	// GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser;
	next();
});

exports.isLoggedIn = async (req, res, next) => {
	try {
		if (req.cookies.jwt) {
			// 1) verify token
			const decoded = await jwt.verify(req.cookies.jwt, 'abcdefebgudjnwksjcscjscsdjkcnjdc');

			// 2) Check if user still exists
			const currentUser = await user.findById(decoded.id);
			if (!currentUser) {
				return next();
			}
			console.log(currentUser);

			// 3) Check if user changed password after the token was issued
			// if (currentUser.changedPasswordAfter(decoded.iat)) {
			//   return next();
			// }

			// THERE IS A LOGGED IN USER
			res.locals.user = currentUser;
			return next();
		}
		next();
	} catch (err) {
		next();
	}
};

exports.logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});
	res.status(200).json({ status: 'success' });
};
