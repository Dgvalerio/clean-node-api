import { AccountModel } from '@/domain/models/account';
import { LoginController } from '@/presentation/controllers/login/login';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
import { HttpRequest } from '@/presentation/protocols';

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
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();

  return { sut };
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
});
