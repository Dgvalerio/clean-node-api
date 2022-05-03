import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/helpers/validators/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: ValidationComposite;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();

  const sut = new ValidationComposite([validationStub]);

  return {
    sut,
    validationStub,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('filed'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('filed'));
  });
});
