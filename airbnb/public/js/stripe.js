const stripe = Stripe(
	'pk_test_51GwBJkGef2TURDJVppUYDkrypZEqBt5jN0fCXMev2n7Tj86zrnAoQKCPldsBWYJXYtpcjrgBWfFjAFBzJEfdp9vd001a3DHx2B'
);

// hotelId grabbed from template  camelcase will convert it by - notation

const bookHotel = async (hotelId) => {
	try {
		// 1. Get checkout session from API
		const session = await axios(`/api/v1/bookings/checkout-session/${hotelId}`);
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
	e.target.textContent = 'Processing...';
	const hotelId = e.target.dataset.hotelId;
	console.log(hotelId);

	bookHotel(hotelId);
});
