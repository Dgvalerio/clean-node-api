import { AccountModel } from '@/domain/models/account';
import { Authentication } from '@/domain/usecases/authentication';
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

  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(
    httpRequest: HttpRequest<Pick<AccountModel, 'email' | 'password'>>
  ): Promise<HttpResponse> {
    try {
      const requiredFields: (keyof Pick<AccountModel, 'email' | 'password'>)[] =
        ['email', 'password'];

      const missingField = requiredFields.find(
        (field) => !httpRequest.body[field]
      );

      if (missingField) return badRequest(new MissingParamError(missingField));

      const { email, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) return badRequest(new InvalidParamError('email'));

      await this.authentication.auth(email, password);
    } catch (error) {
      return serverError(error);
    }
  }
}
