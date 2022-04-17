import { AccountModel } from '@/domain/models/account';
import { MissingParamError } from '@/presentation/errors';
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
    if (!httpRequest.body.email)
      return Promise.resolve(badRequest(new MissingParamError('email')));
    if (!httpRequest.body.password)
      return Promise.resolve(badRequest(new MissingParamError('password')));

    this.emailValidator.isValid(httpRequest.body.email);
  }
}
