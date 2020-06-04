const login = async (email, password) => {
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
			alert('success');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		alert(err.response.data);
	}
};

document.querySelector('.form').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	login(email, password);
});

// const logout = async() => {
//     try{
//         console.log('clicked')
//         const res = await axios({
//             method: 'GET',
//             url: 'http://127.0.0.1:3000/api/v1/users/logout',
//         })
//         if (res.data.status === 'success') location.reload(true)
//     }catch(err){
//         alert('Try Again')
//     }
// }

// document.querySelector('.logout').addEventListener('click',logout)
