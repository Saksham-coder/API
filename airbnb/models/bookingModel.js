const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	hotel: {
		type: mongoose.Schema.ObjectId,
		ref: 'Hotel',
		required: [ true, 'Booking must belong to a Hotel' ]
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'user',
		required: [ true, 'Booking must belong to a user!' ]
	},
	price: {
		type: Number,
		require: [ true, 'Booking must have a price.' ]
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	paid: {
		type: Boolean,
		default: true
	},
	checkin: {
		type: String
	},
	checkout: {
		type: String
	},
	guest: {
		type: String
	},
	price: {
		type: String
	}
});

bookingSchema.pre(/^find/, function(next) {
	// this.populate('hotel');
	// this.populate('user');
	this.populate({
		path: 'hotel',
		select: 'name livelocation ratingsAverage '
	}).populate({
		path: 'user',
		select: 'username photo'
	});
	next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
