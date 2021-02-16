import { registerPropertyValidation, registerValidationType } from "./validator.js";

function buildValidationDecorator(validationCode: string, validator: Function, context?: any) {
	registerValidationType(validationCode, validator);
	return function (klass: any, propName: string) {
		registerPropertyValidation(klass.constructor.name, propName, validationCode, context);
	};
}


export const Required = buildValidationDecorator('required', (value: any) => !!value);

export const PositiveNumber = buildValidationDecorator('positive', (value: number) => value > 0);

export const RangedNumber = (minimum: number, maximum: number) => buildValidationDecorator(
	'ranged-number',
	(value: number, context: any) => (context.min <= value && value <= context.max),
	{
		min: minimum,
		max: maximum
	}
);
