/*
	{
		"Course": {
			"title": ["required"],
			"price": ["positive"]
		}
	}
*/
interface ValidatorConfig {
	[className: string]: {
		[propName: string]: string[]
	}
}

const validatorsRegistry: ValidatorConfig = {};

function registerValidator(className: string, propName: string, validationCode: string) {
	const validators = validatorsRegistry[className]?.[propName] || [];

	validatorsRegistry[className] = {
		...validatorsRegistry[className],
		[propName]: [...validators, validationCode]
	};
}

export function Required(klass: any, propName: string) {
	registerValidator(klass.constructor.name, propName, 'required');
}

export function PositiveNumber(klass: any, propName: string) {
	registerValidator(klass.constructor.name, propName, 'positive');
}

export function validate(obj: any): boolean {
	const validationConfig = validatorsRegistry[obj.constructor.name];
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
