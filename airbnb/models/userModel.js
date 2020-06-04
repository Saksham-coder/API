const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')

const userScehma = new mongoose.Schema({
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
        validate: [ validator.isEmail ,'Provide valid email']
	},
	role: {
		type:String,
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
	}
});

userScehma.pre('save', async function(next){
    console.log(this)
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
} )



const user = mongoose.model('user', userScehma);

module.exports = user;
