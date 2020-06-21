// import axios from 'axios';
// import { showAlert } from './alert';

const hideAlert = () => {
	const el = document.querySelector('.alert');
	if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
	hideAlert();
	const markup = `<div class="alert alert--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, 5000);
};

const logout = async () => {
	try {
		console.log('clicked');
		const res = await axios({
			method: 'GET',
			url: 'http://127.0.0.1:3000/api/v1/users/logout'
		});
		if (res.data.status === 'success') {
			showAlert('success', 'Logged out successfully');
			window.location.assign('http://127.0.0.1:3000/');
		}
	} catch (err) {
		showAlert('error', 'Try Logout aftersometime');
	}
};

document.querySelector('.logout').addEventListener('click', logout);
