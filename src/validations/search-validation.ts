import { object, string } from 'yup';

export const SearchValidation = object({
  username: string()
    .required()
    .min(1)
    .max(20)
    .nonNullable()
    .label('Username'),
  game: string()
    .required()
    .nonNullable()
    .oneOf(['flash', 'mobile'])
    .label('Game'),
});