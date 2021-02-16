import { validate, Required, PositiveNumber, RangedNumber } from './validator/validator.js';

class Course {
	@Required
	title: string;

	@PositiveNumber
	price: number;

	@RangedNumber(1, 6)
	duration: number; // in months

	constructor(title: string, price: number, duration: number) {
		this.title = title;
		this.price = price;
		this.duration = duration;
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
	const $duration = <HTMLInputElement> document.querySelector('[name="duration"]');

	const newCourse = new Course($title.value, +$price.value, +$duration.value);

	showValidationHint(validate(newCourse));
});
