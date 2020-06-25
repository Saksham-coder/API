const host = async (name, location, summary, description, rooms, price) => {
	try {
		// console.log('hi');
		const res = await axios({
			method: 'POST',
			url: '/api/v1/hotels',
			data: {
				name,
				location,
				summary,
				description,
				rooms,
				price
			}
		});
		// console.log(res);
		// console.log(res.data);
		if (res.data.status === 'success') {
			const response = await axios({
				method: 'PATCH',
				url: '/api/v1/users/updateMeHost'
			});
			alert('success');

			window.location.assign('/overview');
		}
	} catch (err) {
		alert(err.data);
		console.log(err);
	}
};

document.querySelector('.hostform').addEventListener('submit', (e) => {
	e.preventDefault();
	const name = document.getElementById('name').value;
	const location = document.getElementById('location').value;
	const summary = document.getElementById('summary').value;
	const description = document.getElementById('description').value;
	const rooms = document.getElementById('rooms').value;
	const price = document.getElementById('price').value;
	host(name, location, summary, description, rooms, price);
});
