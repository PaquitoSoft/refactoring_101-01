interface ValidatorConfig {
	[property: string]: {
		[validatetableProps: string]: string[]
	}
}
/*
	{
		"Course": {
			"title": ["required"],
			"price": ["positive"]
		}
	}
*/

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
	const validators = registeredValidators[target.constructor.name]?.[propName] ?? [];

	registeredValidators[target.constructor.name] = {
		...registeredValidators[target.constructor.name],
		[propName]: [...validators, 'required']
	};
}

function PositiveNumber(target: any, propName: string) {
	const validators = registeredValidators[target.constructor.name]?.[propName] ?? [];

	registeredValidators[target.constructor.name] = {
		...registeredValidators[target.constructor.name],
		[propName]: [...validators, 'positive']
	};
}

function validate(obj: any): boolean {
	const validationConfig = registeredValidators[obj.constructor.name];
	let isValid = true;

	if (!validationConfig) return true;

	for (const prop in validationConfig) {
		for (const validation of validationConfig[prop]) {
			switch(validation) {
				case 'required':
					isValid = isValid && !!obj[prop];
					break;
				case 'positive':
					isValid = isValid && obj[prop] > 0;
					break;
			}
		}
	}

	return isValid;
}

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

function showValidation(isValid: boolean) {
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

	const title = $title.value;
	const price = +$price.value;

	const newCourse = new Course(title, price);

	showValidation(validate(newCourse));
});
