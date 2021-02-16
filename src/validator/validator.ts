/*
	{
		validationCode: "required"
	}
	{
		validationCode: "ranged-number",
		context: {
			min: 0,
			max: 100
		}
	}
*/
type PropertyValidation = {
	validationCode: string,
	context?: any
}

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
		[propName: string]: PropertyValidation[]
	}
}

const validatorsRegistry: ValidatorConfig = {};

function registerValidator(className: string, propName: string, validationCode: string, validationContext?: object) {
	const validators = validatorsRegistry[className]?.[propName] || [];

	validatorsRegistry[className] = {
		...validatorsRegistry[className],
		[propName]: [...validators, { validationCode, context: validationContext }]
	};
}

export function Required(klass: any, propName: string) {
	registerValidator(klass.constructor.name, propName, 'required');
}

export function PositiveNumber(klass: any, propName: string) {
	registerValidator(klass.constructor.name, propName, 'positive');
}

export function RangedNumber(minimum: number, maximum: number) {
	return function (klass: any, propName: string) {
		registerValidator(klass.constructor.name, propName, 'ranged-number', {
			min: minimum,
			max: maximum
		});
	};
}

export function validate(obj: any): boolean {
	const validationConfig = validatorsRegistry[obj.constructor.name];
	let isValid = true;

	if (!validationConfig) return true;

	for (const prop in validationConfig) {
		for (const propValidation of validationConfig[prop]) {
			switch(propValidation.validationCode) {
				case 'required':
					isValid = isValid && !!obj[prop];
					break;
				case 'positive':
					isValid = isValid && obj[prop] > 0;
					break;
				case 'ranged-number':
					isValid = isValid && propValidation.context.min <= obj[prop] && propValidation.context.max >= obj[prop];
					break;
			}
		}
	}

	return isValid;
}
