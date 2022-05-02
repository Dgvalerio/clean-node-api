import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/signup/signup-protocols';
import { InvalidParamError } from '@/presentation/errors';
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
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      const { name, email, password } = httpRequest.body;

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));

      const account = await this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }
}
