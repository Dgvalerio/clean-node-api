import { AccountModel } from '@/domain/models/account';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest, serverError } from '@/presentation/helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import { EmailValidator } from '@/presentation/protocols/email-validator';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(
    httpRequest: HttpRequest<Pick<AccountModel, 'email' | 'password'>>
  ): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) return badRequest(new MissingParamError('email'));
      if (!password) return badRequest(new MissingParamError('password'));

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
