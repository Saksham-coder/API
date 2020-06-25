var fromDate;

document.querySelector('#fromDate').addEventListener('change', () => {
	// console.log('changed');
	fromDate = document.getElementById('fromDate').value;
	// console.log(fromDate);
	document.querySelector('#toDate').setAttribute('min', fromDate);
});

var toDate;
document.querySelector('#toDate').addEventListener('change', () => {
	// console.log('changed');
	toDate = document.getElementById('toDate').value;
	// console.log(toDate);
	document.querySelector('#fromDate').setAttribute('max', toDate);
});
