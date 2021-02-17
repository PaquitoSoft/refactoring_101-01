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
type ValidatorConfig = {
	[className: string]: {
		[propName: string]: PropertyValidation[]
	}
}

/*
	{
		validator: (value: any) => !!value,
		errorMessage: 'Value is required'
	}
*/
type ValidationConfig = {
	validator: Function;
	errorMessage: string;
};

/*
	{
		required: (value) => !! value,
		ranged-number: (value, context) => context.min <= value && value <= context.max
	}
*/
type ValidationsRegistry = {
	[validationCode: string]: ValidationConfig
}

/*
	{
		isValid: false,
		errorMessage: 'Value is required'
	}
*/
export type ValidationResult = {
	isValid: boolean;
	errorMessages: string[];
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

export function registerValidationType(validationCode: string, validationConfig: ValidationConfig) {
	validationsRegistry[validationCode] = validationConfig;
}

export function validate(obj: any): ValidationResult {
	const classValidationConfig = propertiesValidationsRegistry[obj.constructor.name];
	const result: ValidationResult = { isValid: true, errorMessages: [] };
	
	if (!classValidationConfig) return result;

	for (const prop in classValidationConfig) {
		for (const propValidation of classValidationConfig[prop]) {
			const validation = validationsRegistry[propValidation.validationCode];

			if (!validation) throw new Error(`No validation registerd for code "${propValidation.validationCode}"`);

			if (!validation.validator(obj[prop], propValidation.context)) {
				result.isValid = false;
				result.errorMessages.push(`"${prop}" property is not valid: ${validation.errorMessage}`);
			}
		}
	}

	return result;
}
