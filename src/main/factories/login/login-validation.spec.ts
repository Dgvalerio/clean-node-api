import { makeLoginValidation } from '@/main/factories/login/login-validation';
import { EmailValidation } from '@/presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';
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
