// import axios from 'axios';
// import { showAlert } from './alert';
// export const
login = async (email, password) => {
	try {
		// console.log(email, password);
		// alert(email,password)
		// console.log(email, password);
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/login',
			data: {
				email,
				password
			}
		});
		// console.log(res);
		// console.log(res.data);
		if (res.data.status === 'success') {
			// alert('success');
			alert('success');
			window.setTimeout(() => {
				location.assign('/');
			}, 5000);
		}
	} catch (err) {
		// alert(err.response.data.message);
		alert(err.response.data.message);
		window.location.assign('/forgetPassword');
	}
};

document.querySelector('.form--login').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	login(email, password);
});
