const forget = async (email) => {
	try {
		console.log(email);
		console.log(email);
		const res = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
			data: {
				email
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

document.querySelector('.forget_form').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	forget(email);
});
