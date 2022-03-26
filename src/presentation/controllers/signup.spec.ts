import { SignUpController } from '@/presentation/controllers/signup';

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
