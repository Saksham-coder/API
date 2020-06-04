const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.updateMeHost = catchAsync(async (req, res) => {
	console.log('From Update host middleware');
	console.log(req.user);
	const updatedUser = await User.findByIdAndUpdate(
		req.user._id,
		{
			role: 'host'
		},
		{
			new: true,
			runValidators: true
		}
	);

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser
		}
	});
});
