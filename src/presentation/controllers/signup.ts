import { AddAccount } from '@/domain/usecases/add-account';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest, serverError } from '@/presentation/helpers/http-helper';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';

export interface SignUpDto {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest<SignUpDto>): HttpResponse {
    try {
      const requiredFields: (keyof SignUpDto)[] = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      const missingField = requiredFields.find(
        (field) => !httpRequest.body[field]
      );

      if (missingField) return badRequest(new MissingParamError(missingField));

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'));

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));

      this.addAccount.add({ name, email, password });
    } catch (err) {
      return serverError();
    }
  }
}
