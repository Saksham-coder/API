const signup = async (email, password, username, confirmPassword) => {
	try {
		console.log("From ajax"+ email, password, username, confirmPassword);
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
		alert('Dont use Email twice and also check password match');
		console.log(err);
	}
};

document.querySelector('.signform').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const username = document.getElementById('username').value;
	const confirmPassword = document.getElementById('confirmPassword').value;
	signup(email, password, username, confirmPassword);
});

document.querySelector('.carousel').addEventListener('carousel', ()=>{
	interval:200
})
