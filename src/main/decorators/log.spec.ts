import { LogControllerDecorator } from '@/main/decorators/log';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Zé',
        },
      };

      return Promise.resolve(httpResponse);
    }
  }

  return new ControllerStub();
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();

  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
