import { registerPropertyValidation, registerValidationType } from "./validator.js";

export type ValidationConfig = {
	validator: Function;
	errorMessage: string;
}

function buildValidationDecorator(validationCode: string, validationConfig: ValidationConfig, context?: any) {
	registerValidationType(validationCode, validationConfig);
	return function (klass: any, propName: string) {
		registerPropertyValidation(klass.constructor.name, propName, validationCode, context);
	};
}


export const Required = buildValidationDecorator('required', {
	validator: (value: any) => !!value,
	errorMessage: 'Value is required'
});

export const PositiveNumber = buildValidationDecorator('positive', {
	validator: (value: number) => value > 0,
	errorMessage: 'Value must be a poisitive number'
});

export const RangedNumber = (minimum: number, maximum: number) => buildValidationDecorator(
	'ranged-number',
	{
		validator: (value: number, context: any) => (context.min <= value && value <= context.max),
		errorMessage: `Value must be a number between ${minimum} and ${maximum} (both included).`
	},	
	{
		min: minimum,
		max: maximum
	}
);
