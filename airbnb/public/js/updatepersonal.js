const updatepersonal = async (data) => {
	try {
		console.log(data);
		const res = await axios({
			method: 'PATCH',
			url: 'http://127.0.0.1:3000/api/v1/users/updatePersonal',
			data
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

document.querySelector('.personalform').addEventListener('submit', (e) => {
	e.preventDefault();
	const form = new FormData();
	form.append('username', document.getElementById('username').value);
	form.append('gender', document.getElementById('gender').value);
	form.append('dob', document.getElementById('dob').value);
	form.append('email', document.getElementById('email').value);
	form.append('phone_number', document.getElementById('phone_number').value);
	form.append('address', document.getElementById('address').value);
	form.append('photo', document.getElementById('photo').files[0]);

	console.log(form);

	updatepersonal(form);
});
