const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;

	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

	// console.log(value);

	const message = `Duplicate field value: ${value}. Please use another value!`;

	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join('. ')}`;

	return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
	// API
	console.log('HI from error dev controller');
	// if (req.originalUrl.startsWith('/api')) {

	res.status(err.statusCode).json({
		status: err.status,

		error: err,

		message: err.message,

		stack: err.stack
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;

	err.status = err.status || 'error';

	let error = { ...err };

	error.message = err.message;

	console.log(error);
	if (error.name === 'CastError') error = handleCastErrorDB(error);

	if (error.code === 11000) error = handleDuplicateFieldsDB(error);

	if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

	sendErrorDev(error, req, res);
};
