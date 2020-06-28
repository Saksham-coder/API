const stripe = Stripe(
	'pk_test_51GwBJkGef2TURDJVppUYDkrypZEqBt5jN0fCXMev2n7Tj86zrnAoQKCPldsBWYJXYtpcjrgBWfFjAFBzJEfdp9vd001a3DHx2B'
);

// hotelId grabbed from template  camelcase will convert it by - notation

const bookHotel = async (hotelId, checkin, checkout, guest, price) => {
	try {
		// 1. Get checkout session from API
		// success_url: `${req.protocol}://${req.get('host')}/?hotel=${req.params.hotelId}&user=${req.user
		// 	.id}&price=${hotel.price}`,
		const session = await axios(
			`/api/v1/bookings/checkout-session/?hotelId=${hotelId}&checkin=${checkin}&checkout=${checkout}&guest=${guest}&price=${price}`
		);
		console.log('session for booking by axios');
		console.log(axios);
		// console.log(session);
		// 2.Create checkout form + charge credit card
		await stripe.redirectToCheckout({
			sessionId: session.data.session.id
			// sessionId: session.id
		});
	} catch (err) {
		console.log(err);
		alert(err);
	}
};

document.getElementById('book-tour').addEventListener('click', (e) => {
	e.preventDefault();
	e.target.textContent = 'Processing...';
	const hotelId = e.target.dataset.hotelId;
	const checkin = document.getElementById('checkin').value;
	const checkout = document.getElementById('checkout').value;
	const guest = document.getElementById('guest').value;
	const price = document.querySelector('.total_payment').innerText;

	console.log(hotelId, checkin, checkout, guest, price);

	bookHotel(hotelId, checkin, checkout, guest);
});
