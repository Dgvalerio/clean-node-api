import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from '@/presentation/helpers/validators/compare-fields-validation';

const makeSut = (
  fieldName = 'field',
  fieldToCompare = 'fieldToCompare'
): CompareFieldsValidation =>
  new CompareFieldsValidation(fieldName, fieldToCompare);

describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_name',
      fieldToCompare: 'wrong_name',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_name',
      fieldToCompare: 'any_name',
    });

    expect(error).toBeFalsy();
  });
});
