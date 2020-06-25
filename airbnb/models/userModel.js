const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	// name: String
	username: {
		type: String,
		required: [ true, 'YOu must enter username' ]
	},
	email: {
		type: String,
		required: [ true, 'YOu must enter email' ],
		unique: true,
		lowercase: true,
		validate: [ validator.isEmail, 'Provide valid email' ]
	},
	role: {
		type: String,
		default: 'user'
	},
	password: {
		type: String,
		required: [ true, 'YOu must enter password' ]
	},
	confirmPassword: {
		type: String,
		required: [ true, 'Please confirm your password' ],
		validate: {
			validator: function(value) {
				return value === this.password;
			},
			message: 'Password are not same'
		}
	},
	photo: {
		type: String,
		default: 'default.jpg'
	},
	passwordResetToken: String,
	passwordResetExpires: Date,
	gender: String,
	dob: String,
	phone_number: Number,
	address: String
});

userSchema.pre('save', async function(next) {
	// console.log(this);
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;
	next();
});

// userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
// 	return await bcrypt.compare(candidatePassword, userPassword);
// };

userSchema.methods.createPasswordResetToken = function() {
	// console.log('hi from model instance');
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	// console.log({ resetToken }, this.passwordResetToken);
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const user = mongoose.model('user', userSchema);

module.exports = user;
