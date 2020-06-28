// import axios from 'axios';
// export const
signup = async (email, password, username, confirmPassword) => {
	try {
		// console.log('From ajax' + email, password, username, confirmPassword);
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/signup',
			data: {
				email,
				password,
				username,
				confirmPassword
			}
		});
		// console.log(res);
		// console.log(res.data);
		if (res.data.status === 'success') {
			alert('success');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		alert(err.response.data.message);
		// console.log(err);
	}
};

document.querySelector('.signform').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const username = document.getElementById('username').value;
	const confirmPassword = document.getElementById('confirmPassword').value;
	console.log(email, password, username, confirmPassword);
	signup(email, password, username, confirmPassword);
});
