const mongoose = require('mongoose');
const slug = require('slugify');

const hotelSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'A Hotel must have name' ]
		},
		hotel_type: {
			type: String,
			default: 'Private Room'
		},
		location: {
			type: String,
			required: [ true, 'A Hotel must have Location' ]
		},

		summary: {
			type: String,
			required: [ true, 'A Hotel must have summary' ]
		},
		description: {
			type: String,
			required: [ true, 'A Hotel must have description' ]
		},
		sleeping_arrangements: {
			type: String,
			default: '1 king Bed'
		},
		facility: {
			type: String
			// required: [ true, 'A Hotel must have description' ]
		},
		rooms: {
			type: Number,
			required: [ true, 'A Hotel must have rooms' ]
		},
		price: {
			type: Number,
			required: [ true, 'A Hotel must have price' ]
		},
		priceDiscount: {
			type: Number
		},
		imageCover: {
			type: String
			// required: [ true, 'A Hotel must have image' ]
		},
		imageCover: {
			type: String
			// required: [ true, 'A Hotel must have image' ]
		},
		slug: String,
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false
		},
		ratingsAverage: {
			type: String,
			default: 4.5,
			min: [ 1, 'A Hotel must have rating above 1.0' ],
			max: [ 1, 'A Hotel must have rating below 5.0' ]
		},
		ratingsQuantity: {
			type: Number,
			default: 0
		},
		livelocation: {
			// GeoJSON
			type: {
				type: String,
				default: 'Point',
				enum: [ 'Point' ]
			},
			coordinates: [ Number ],
			address: String,
			description: String
		},
		// "startLocation": {
		// 	"description": "Miami, USA",
		// 	"type": "Point",
		// 	"coordinates": [-80.185942, 25.774772],
		// 	"address": "301 Biscayne Blvd, Miami, FL 33132, USA"
		//   },
		//   "ratingsAverage": 4.8,
		//   "ratingsQuantity": 6,
		host: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'user'
			}
		]
		// reviews: [
		// 	{
		// 		type: mongoose.Schema.ObjectId,
		// 		ref: 'Review'
		// 	}
		// ]
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

hotelSchema.index({ price: 1, ratingsAverage: -1 });
hotelSchema.index({ slug: 1 });

// Virtual populate
hotelSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'hotel',
	localField: '_id'
});

hotelSchema.pre(/^find/, function(next) {
	// this.populate('hotel');
	// this.populate('user');
	this.populate({
		path: 'host',
		select: 'username photo'
	});
	next();
});

hotelSchema.pre('save', function(next) {
	console.log(this);
	this.slug = slug(this.name, { lower: true });
	next();
});

// hotelSchema.pre(/^find/, function(next) {
// 	this.populate({
// 		path: 'host',
// 		select: '-__v'
// 	});
// 	next();
// });

hotelSchema.index({ location: '2dsphere' });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
