import { validate, ValidationResult } from './validator/validator.js';
import { Required, PositiveNumber, RangedNumber } from './validator/validations.js';

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

const $form = document.querySelector('form')!;

function showValidationHint(validationResult: ValidationResult) {
	const $validationMessage = <HTMLElement> $form.querySelector('.validation-message');
	$validationMessage.style.display = 'block';
	if (validationResult.isValid) {
		$validationMessage.classList.add('valid');
		$validationMessage.classList.remove('invalid');
		$validationMessage.innerHTML = '<span>Data is valid</span>';
	} else {
		$validationMessage.classList.add('invalid');
		$validationMessage.classList.remove('valid');
		$validationMessage.innerHTML = `<ul>${validationResult.errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
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
