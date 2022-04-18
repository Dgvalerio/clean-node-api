import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/signup/signup-protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http-helper';

export interface SignUpDto {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest<SignUpDto>): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body);

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

      const account = await this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }
}
