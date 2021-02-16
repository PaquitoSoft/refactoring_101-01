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
			"title": { "validationCode": "required" },
			"price": { "validationCode": "ranged-number", "context": { "min": 1, "max": 6 }}
		}
	}
*/
interface ValidatorConfig {
	[className: string]: {
		[propName: string]: PropertyValidation[]
	}
}

/*
	{
		"required": (value) => !! value,
		"ranged-number": (value, context) => context.min <= value && value <= context.max
	}
*/
interface ValidationsRegistry {
	[validationCode: string]: Function
}


const propertiesValidationsRegistry: ValidatorConfig = {};
const validationsRegistry: ValidationsRegistry = {};

export function registerPropertyValidation(className: string, propName: string, validationCode: string, validationContext?: object) {
	const validators = propertiesValidationsRegistry[className]?.[propName] || [];

	propertiesValidationsRegistry[className] = {
		...propertiesValidationsRegistry[className],
		[propName]: [...validators, { validationCode, context: validationContext }]
	};
}

export function registerValidationType(validationCode: string, validator: Function) {
	validationsRegistry[validationCode] = validator;
}

export function validate(obj: any): boolean {
	const validationConfig = propertiesValidationsRegistry[obj.constructor.name];
	
	if (!validationConfig) return true;

	for (const prop in validationConfig) {
		for (const propValidation of validationConfig[prop]) {
			const validator = validationsRegistry[propValidation.validationCode];

			if (!validator) throw new Error(`No validator function registerd for code "${propValidation.validationCode}"`);

			if (!validator(obj[prop], propValidation.context)) {
				return false;
			}
		}
	}

	return true;
}
