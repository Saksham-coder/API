const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');

exports.signup = catchAsync(async (req, res) => {
	// console.log('From auth' + req.body);
	const newUser = await user.create(req.body);

	const url = `${req.protocol}://${req.get('host')}/me/personal`;
	// console.log(url);
	await new Email(newUser, url).sendWelcome();

	id = newUser._id;

	// Sending  Token as Cookie
	const token = jwt.sign({ id }, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	const cookieOptions = {
		expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	// console.log(token);
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

	// 1) Check if email and password exist
	if (!email || !password) throw new err('Please provide username or password', 404);

	// 2) Check if user exists && password is correct
	const singleUser = await user.findOne({ email: email });
	// console.log(singleUser)
	const correct = await bcrypt.compare(password, singleUser.password);

	if (!singleUser || !correct) throw new err('Please provide valid username or password', 404);

	id = singleUser._id;

	// 3) If everything ok, send token to client
	const token = jwt.sign({ id }, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	// console.log(token);
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
	// console.log('Welcome to protected route');
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	// console.log(token);
	if (!token) {
		return next(new AppError('You are not logged in! Please log in to get access.', 401));
	}

	// 2) Verification token
	const decoded = await jwt.verify(token, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	// console.log(decoded);
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
	// console.log('giving current user from protected user');
	// console.log(currentUser);
	// GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser;
	req.locals.user = currentUser;
	next();
});

// Only for rendered pages, no errors!
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
			// console.log(currentUser);

			// 3) Check if user changed password after the token was issued
			// if (currentUser.changedPasswordAfter(decoded.iat)) {
			//   return next();
			// }

			// THERE IS A LOGGED IN USER
			req.user = currentUser;
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

exports.updatePassword = catchAsync(async (req, res) => {
	// 1) Get user from collection
	// console.log('Hi from updatepassword controller');
	// console.log(req.body);
	const User = await user.findById(req.user.id).select('+confirmPassword');

	// console.log('correct password and you are getting User');
	// console.log(User);

	// 2) Check if POSTed current password is correct
	if (!await bcrypt.compare(req.body.currentPassword, User.password)) {
		return next(new AppError('Your current password is wrong.', 401));
	}

	// 3) If so, update password
	User.password = req.body.password;
	User.confirmPassword = req.body.newPassword;
	// console.log('after setting confirm password');
	// console.log(User);
	await User.save();
	// console.log(User);
	// User.findByIdAndUpdate will NOT work as intended!
	id = User._id;
	const token = jwt.sign({ id }, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	// 4) Log user in, send JWT
	const cookieOptions = {
		expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	res.cookie('jwt', token, cookieOptions);
	// console.log('SENDING COOKIESSSSSSsss');
	res.status(200).json({
		status: 'success',
		token: token
	});
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const User = await user.findOne({ email: req.body.email });
	if (!User) {
		return next(new AppError('There is no User with email address.', 404));
	}
	// 2) Generate the random reset token
	const resetToken = User.createPasswordResetToken();
	await User.save({ validateBeforeSave: false });
	// 3) Send it to User's email

	try {
		const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
		const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

		await new Email(User, resetURL).sendPasswordReset();
		// await sendEmail({
		// 	email: User.email,
		// 	subject: 'Your password reset token (valid for 10 min)',
		// 	message
		// });
		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!'
		});
	} catch (err) {
		User.passwordResetToken = undefined;
		User.passwordResetExpires = undefined;
		await User.save({ validateBeforeSave: false });
		return next(new AppError('There was an error sending the email. Try again later!'), 500);
	}
});

exports.resetPassword = async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	const User = await user.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() }
	});
	// 2) If token has not expired, and there is User, set the new password
	if (!User) {
		return next(new AppError('Token is invalid or has expired', 400));
	}
	User.password = req.body.password;
	User.confirmPassword = req.body.confirmPassword;
	User.passwordResetToken = undefined;
	User.passwordResetExpires = undefined;
	await User.save();
	// 3) Update changedPasswordAt property for the User
	// 4) Log the User in, send JWT
	// createSendToken(User, 200, res);
	id = User._id;
	const token = jwt.sign({ id }, 'abcdefebgudjnwksjcscjscsdjkcnjdc');
	// console.log(token);
	const cookieOptions = {
		expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	res.cookie('jwt', token, cookieOptions);
	res.status(200).json({
		status: 'success',
		token: token
	});
};
