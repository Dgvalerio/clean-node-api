import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';

import validator from 'validator';

jest.mock('validator', () => ({
  isEmail: (): boolean => true,
}));

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe('EmailValidator Adapter', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('Should return false if validator returns false', () => {
    const sut = makeSut();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();

    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = makeSut();
    const email = 'valid_email@mail.com';

    jest.spyOn(validator, 'isEmail');

    sut.isValid(email);

    expect(validator.isEmail).toHaveBeenCalledTimes(1);
    expect(validator.isEmail).toHaveBeenCalledWith(email);
  });
});
