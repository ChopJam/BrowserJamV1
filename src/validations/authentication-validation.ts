import { object, string } from 'yup';

export const AuthenticationValidation = object({
  screen_name: string()
    .required()
    .min(1)
    .max(20)
    .nonNullable()
    .label('Screen Name'),
  password: string()
    .required()
    .min(6)
    .nonNullable()
    .label('Password'),
});