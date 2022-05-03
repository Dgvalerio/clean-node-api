import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators';
import { Validation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password'];

  const validations: Validation[] = fields.map(
    (field) => new RequiredFieldValidation(field)
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};