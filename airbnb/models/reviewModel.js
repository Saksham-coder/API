const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: [ true, 'Review is required' ]
	},
	rating: {
		type: Number,
		min: 1,
		max: 5
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	hotel: {
		type: mongoose.Schema.ObjectId,
		ref: 'Hotel',
		required: [ true, 'A hotel is required to write review on' ]
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'user',
		required: [ true, 'A user is required to write review' ]
	}
});

reviewSchema.pre(/^find/, function(next) {
	this.populate('hotel');
	this.populate('user');

	// 		path: 'hotel'
	// 		// select: ''
	// 	});
	// 	// .populate({
	// 	// 	path: 'user'
	// 	// });
	next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
