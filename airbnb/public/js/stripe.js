const stripe = Stripe('pk_test_51GwBJkGef2TURDJVppUYDkrypZEqBt5jN0fCXMev2n7Tj86zrnAoQKCPldsBWYJXYtpcjrgBWfFjAFBzJEfdp9vd001a3DHx2B');


// hotelId grabbed from template  camelcase will convert it by - notation

const bookHotel =async hotelId => {
    try{
    // 1. Get checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${hotelId}`)
    console.log("session for booking by axios")
    console.log(axios)
    // 2.Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    });

} catch(err){
    console.log(err);
    alert(err)
}
}

document.getElementById('book-tour').addEventListener('click', e=>{
    e.target.textContent = 'Processing...'
    const hotelId = e.target.dataset.hotelId
    bookHotel(hotelId)
})