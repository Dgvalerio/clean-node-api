import { makeSignUpValidation } from '@/main/factories/signup-validation';
import { CompareFieldsValidation } from '@/presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation';
import { Validation } from '@/presentation/helpers/validators/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';

jest.mock('@/presentation/helpers/validators/validation-composite');

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

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
