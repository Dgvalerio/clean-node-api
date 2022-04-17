import { AccountModel } from '@/domain/models/account';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
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
    const { email, password } = httpRequest.body;

    if (!email)
      return Promise.resolve(badRequest(new MissingParamError('email')));
    if (!password)
      return Promise.resolve(badRequest(new MissingParamError('password')));

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return Promise.resolve(badRequest(new InvalidParamError('email')));
    }
  }
}
