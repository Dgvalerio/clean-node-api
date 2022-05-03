import { makeLoginValidation } from '@/main/factories/login/login-validation';
import {
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

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validation', () => {
    makeLoginValidation();

    const fields = ['email', 'password'];
    const validations: Validation[] = fields.map(
      (field) => new RequiredFieldValidation(field)
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
