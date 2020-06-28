const express = require('express');
const cors = require('cors');
const hotelRouter = require('./routes/hotelRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');

// Error handler

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const bodyParser = require('body-parser');
const app = express();

// Pug engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
	// console.log(req.cookies);
	next();
});

app.use(compression());

// Routes

// VIEW ROUTES
app.use('/', viewRouter);

// API ROUTES
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
	// res.status(404).json({
	// 	status: 'fail',
	// 	message: `Cant find ${req.originalUrl} on this server`
	// });
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
