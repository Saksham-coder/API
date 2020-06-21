import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
	try {
		console.log(email, password);
		// alert(email,password)
		console.log(email, password);
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/login',
			data: {
				email,
				password
			}
		});
		console.log(res);
		console.log(res.data);
		if (res.data.status === 'success') {
			// alert('success');
			showAlert('success', 'Logged in successfully');
			window.setTimeout(() => {
				location.assign('/');
			}, 5000);
		}
	} catch (err) {
		// alert(err.response.data.message);
		showAlert('error', err.response.data.message);
		window.location.assign('http://127.0.0.1:3000/forgetPassword');
	}
};
