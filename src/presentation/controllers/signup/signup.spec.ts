import {
  SignUpController,
  SignUpDto,
} from '@/presentation/controllers/signup/signup';
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
  HttpRequest,
} from '@/presentation/controllers/signup/signup-protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors';

const httpRequestFake = (): HttpRequest<SignUpDto> => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
      };
    }
  }

  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
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

  test('Should return 400 if no password confirmation fails', () => {
    const { sut } = makeSut();
    const httpRequest = httpRequestFake();

    httpRequest.body.password = '123';
    httpRequest.body.passwordConfirmation = '456';

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
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

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = httpRequestFake();

    jest.spyOn(addAccountStub, 'add');

    sut.handle(httpRequest);

    expect(addAccountStub.add).toHaveBeenCalledTimes(1);
    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });
});
