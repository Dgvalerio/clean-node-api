import { makeSignUpValidation } from '@/main/factories/signup/signup-validation';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { Validation } from '@/presentation/protocols/validation';

jest.mock('@/presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validation', () => {
    makeSignUpValidation();

    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    const validations: Validation[] = fields.map(
      (field) => new RequiredFieldValidation(field)
    );

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
