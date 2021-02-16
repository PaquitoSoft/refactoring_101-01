import { validate, Required, PositiveNumber } from './validator/validator.js';

class Course {
	@Required
	title: string;

	@PositiveNumber
	price: number;

	constructor(title: string, price: number) {
		this.title = title;
		this.price = price;
	}
}

const $form = <HTMLFormElement> document.querySelector('form');

function showValidationHint(isValid: boolean) {
	if (isValid) {
		$form.classList.remove('invalid');
		$form.classList.add('valid');
	} else {
		$form.classList.remove('valid');
		$form.classList.add('invalid');
	}
}

$form.addEventListener('submit', event => {
	event.preventDefault();
	const $title = <HTMLInputElement> document.querySelector('[name="title"]');
	const $price = <HTMLInputElement> document.querySelector('[name="price"]');

	const newCourse = new Course($title.value, +$price.value);

	showValidationHint(validate(newCourse));
});
