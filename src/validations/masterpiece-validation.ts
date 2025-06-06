import { mixed, object, string } from 'yup';

export const MasterpieceValidation = object({
  username: string()
    .required()
    .min(1)
    .max(20)
    .nonNullable()
    .label('Username'),
  files: mixed()
    .required()
    .nonNullable()
    .label('Files'),
});