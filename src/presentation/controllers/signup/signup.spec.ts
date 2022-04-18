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
  Validation,
} from '@/presentation/controllers/signup/signup-protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http-helper';

const makeFakeRequest = (): HttpRequest<SignUpDto> => ({
  body: {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
    passwordConfirmation: 'valid_password',
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const accountFake = makeFakeAccount();

      return Promise.resolve(accountFake);
    }
  }

  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  );

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    httpRequest.body.password = '123';
    httpRequest.body.passwordConfirmation = '456';

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    );
  });

  test('Should return 400 if no invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const email = 'anything';

    httpRequest.body.email = email;
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    expect(emailValidatorStub.isValid).toHaveBeenCalledTimes(1);
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(email);
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementation(() => Promise.reject(new Error()));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(addAccountStub, 'add');

    await sut.handle(httpRequest);

    expect(addAccountStub.add).toHaveBeenCalledTimes(1);
    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(validationStub, 'validate');

    await sut.handle(httpRequest);

    expect(validationStub.validate).toHaveBeenCalledTimes(1);
    expect(validationStub.validate).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const fakeError = new MissingParamError('any_field');

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(fakeError);

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(fakeError));
  });
});
