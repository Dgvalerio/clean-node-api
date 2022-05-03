import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators';
import { Validation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation'];

  const validations: Validation[] = fields.map(
    (field) => new RequiredFieldValidation(field)
  );

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
