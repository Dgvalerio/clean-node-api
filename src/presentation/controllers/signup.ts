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

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
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

      const { email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'));

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));
    } catch (err) {
      return serverError();
    }
  }
}
