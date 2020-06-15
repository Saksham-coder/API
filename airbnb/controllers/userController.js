const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');

const multerStorage = multer.diskStorage({
	  destination: (req, file, cb) => {
	    cb(null, 'public/img/users');
	  },
	  filename: (req, file, cb) => {
	    const ext = file.mimetype.split('/')[1];
	    cb(null, `user-${req.user.id}.${ext}`);
	  }
	});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');


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

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.getUser = async (req, res) => {
	try {
		// console.log(req.params)
		const oneUser = await User.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: {
				data: oneUser
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};

exports.updatePersonal = async (req, res) => {
	try {
		console.log('hi from update personal controller');
		id = req.user._id;


		if(req.file) req.body.photo = req.file.filename
		const updatedUser = await User.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true
		});

		res.status(200).json({
			status: 'success',
			data: {
				data: updatedUser
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		});
	}
};
