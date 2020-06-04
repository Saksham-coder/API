const mongoose = require('mongoose');
const slug = require('slugify');

const hotelSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'A Hotel must have name' ]
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
		host: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'user'
			}
		],
		reviews: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Review'
			}
		]
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// hotelSchema.virtual('reviews', {
// 	ref: 'Review',
// 	foreignField: 'hotel',
// 	localField: '_id'
// });

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

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
