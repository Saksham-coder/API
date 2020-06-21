const mongoose = require('mongoose');
const Hotel = require('./hotelModel');

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
	// this.populate('hotel');
	// this.populate('user');
	this.populate({
		path: 'hotel',
		select: 'name'
	}).populate({
		path: 'user',
		select: 'username photo'
	});
	next();
});

reviewSchema.statics.calcAverageRatings = async function(hotelId) {
	const stats = await this.aggregate([
		{
			$match: { hotel: hotelId }
		},
		{
			$group: {
				_id: '$hotel',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' }
			}
		}
	]);
	console.log('consoling stats below');

	console.log(stats);

	if (stats.length > 0) {
		await Hotel.findByIdAndUpdate(hotelId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating
		});
	} else {
		await Hotel.findByIdAndUpdate(hotelId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5
		});
	}
};

reviewSchema.post('save', function() {
	// this points to current review
	this.constructor.calcAverageRatings(this.hotel);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
