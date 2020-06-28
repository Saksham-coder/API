var fromDate;
document.querySelector('#checkin').addEventListener('change', () => {
	// console.log('changed');
	checkin = document.getElementById('checkin').value;
	// console.log(checkin);
	document.querySelector('#checkout').setAttribute('min', checkin);
});
var toDate;
document.querySelector('#checkout').addEventListener('change', () => {
	// console.log('changed');
	// console.log(checkout.value);
	// console.log(document.getElementById('checkin').value);
	// console.log(document.querySelector('.total_payment').innerText);

	checkout = document.getElementById('checkout').value;

	// console.log(checkout.value - document.getElementById('checkin').value);

	var date1 = new Date(document.getElementById('checkin').value);
	var date2 = new Date(checkout);
	// To calculate the time difference of two dates
	var Difference_In_Time = date2.getTime() - date1.getTime();

	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

	// console.log(Difference_In_Days);
	var newprice = document.querySelector('.total_payment').innerText * Difference_In_Days;

	console.log(newprice);

	document.querySelector('.total_payment').innerText = newprice;
	// console.log(checkout);
	document.querySelector('#checkin').setAttribute('max', checkout);
});
