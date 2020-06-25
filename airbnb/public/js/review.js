const reviewing = async (review, rating, id, idh) => {
	try {
		// console.log('From ajax' + review, rating, id, idh);
		// `${req.protocol}://${req.get('host')}/me/personal`

		const res = await axios({
			method: 'POST',
			url: '/api/v1/reviews',
			data: {
				review,
				rating,
				user: id,
				hotel: idh
			}
		});
		// console.log(res);
		// console.log(res.data);
		if (res.data.status === 'success') {
			alert('success');
			window.setTimeout(() => {
				location.assign(`/overview/${idh}`);
			}, 1500);
		}
	} catch (err) {
		alert('Some error is there . just review after some time');
		console.log(err);
	}
};

document.querySelector('.reviewform').addEventListener('submit', (e) => {
	e.preventDefault();
	const review = document.getElementById('review').value;
	const rating = document.getElementById('rating').value;
	const id = document.getElementById('id').innerHTML;
	const idh = document.getElementById('idh').innerHTML;
	reviewing(review, rating, id, idh);
});
