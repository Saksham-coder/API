const updatesecurity = async (currentPassword, password, newPassword) => {
	try {
		console.log(currentPassword, password, newPassword);
		// alert(email,password)
		const res = await axios({
			method: 'PATCH',
			url: 'http://127.0.0.1:3000/api/v1/users/updatePassword',
			data: {
				currentPassword,
				password,
				newPassword
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
		alert(err.response.data);
	}
};

document.querySelector('.securityform').addEventListener('submit', (e) => {
	e.preventDefault();
	const currentPassword = document.getElementById('passwordCurrent').value;
	const password = document.getElementById('password').value;
	const newPassword = document.getElementById('confirmPassword').value;
	updatesecurity(currentPassword, password, newPassword);
});
