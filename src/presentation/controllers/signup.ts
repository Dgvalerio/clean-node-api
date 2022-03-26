import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest, serverError } from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

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

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));
    } catch (err) {
      return serverError();
    }
  }
}
