const length = document.querySelectorAll('.overview').length;
console.log(length);
const final_length = 38 + 90 + 251 * length + 107;

console.log(document.querySelector('.overview').parentElement.nextElementSibling);

document.querySelector('.overview').parentElement.nextElementSibling.setAttribute('style', `width: ${final_length}px`);
