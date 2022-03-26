import { SignUpController, SignUpDto } from '@/presentation/controllers/signup';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest } from '@/presentation/protocols/http';

const httpRequestFake = (): HttpRequest<SignUpDto> => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    passwordConfirmation: 'any_passwordConfirmation',
  },
});

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();

  const sut = new SignUpController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = httpRequestFake();

    delete httpRequest.body.name;

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = httpRequestFake();

    delete httpRequest.body.email;

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = httpRequestFake();

    delete httpRequest.body.password;

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = httpRequestFake();

    delete httpRequest.body.passwordConfirmation;

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if no invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = httpRequestFake();
    const email = 'anything';

    httpRequest.body.email = email;
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    expect(emailValidatorStub.isValid).toHaveBeenCalledTimes(1);
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(email);
  });

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = httpRequestFake();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error();
    });

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
