import { AccountModel } from '@/domain/models/account';
import { LoginController } from '@/presentation/controllers/login/login';
import {
  HttpRequest,
  EmailValidator,
  Authentication,
} from '@/presentation/controllers/login/login-protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http-helper';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new AuthenticationStub();
};

const makeFakeRequest = (): HttpRequest<
  Pick<AccountModel, 'email' | 'password'>
> => ({
  body: {
    email: 'any_email',
    password: 'any_password',
  },
});

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();

  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return { sut, emailValidatorStub, authenticationStub };
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    delete httpRequest.body.email;

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    delete httpRequest.body.password;

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
    expect(isValidSpy).toHaveBeenCalledTimes(1);
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call Authentication with correct email', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    );
    expect(authSpy).toHaveBeenCalledTimes(1);
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
});
