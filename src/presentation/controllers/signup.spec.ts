import { SignUpController, SignUpDto } from '@/presentation/controllers/signup';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { HttpRequest } from '@/presentation/protocols/http';

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();

    const httpRequest: HttpRequest<SignUpDto> = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();

    const httpRequest: HttpRequest<SignUpDto> = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();

    const httpRequest: HttpRequest<SignUpDto> = {
      body: {
        name: 'any_name',
        email: 'any_name',
        passwordConfirmation: 'any_passwordConfirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no password confirmation is provided', () => {
    const sut = new SignUpController();

    const httpRequest: HttpRequest<SignUpDto> = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });
});
