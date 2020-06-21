console.log('hello from the parcel');
import '@babel/polyfill';
import { login } from './login';
import { signup } from './signup';
// import { logout } from './logout';

document.querySelector('.form--login').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	login(email, password);
});

document.querySelector('.signform').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const username = document.getElementById('username').value;
	const confirmPassword = document.getElementById('confirmPassword').value;
	signup(email, password, username, confirmPassword);
});
