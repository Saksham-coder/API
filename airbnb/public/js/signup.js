import axios from 'axios';
export const signup = async (email, password, username, confirmPassword) => {
	try {
		console.log('From ajax' + email, password, username, confirmPassword);
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/signup',
			data: {
				email,
				password,
				username,
				confirmPassword
			}
		});
		console.log(res);
		console.log(res.data);
		if (res.data.status === 'success') {
			alert('success');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		alert(err.response.data.message);
		console.log(err);
	}
};
