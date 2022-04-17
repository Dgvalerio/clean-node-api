import { AddAccountModel } from '@/domain/usecases/add-account';
import { LoginController } from '@/presentation/controllers/login/login';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
import { HttpRequest } from '@/presentation/protocols';

const makeFakeRequest = (): HttpRequest<
  Pick<AddAccountModel, 'email' | 'password'>
> => ({
  body: {
    email: 'valid_email',
    password: 'valid_password',
  },
});

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest = makeFakeRequest();

    delete httpRequest.body.email;

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
});
