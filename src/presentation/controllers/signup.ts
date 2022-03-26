import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { badRequest } from '@/presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export interface SignUpDto {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export class SignUpController {
  handle(httpRequest: HttpRequest<SignUpDto>): HttpResponse {
    if (!httpRequest.body.name)
      return badRequest(new MissingParamError('name'));
    if (!httpRequest.body.email)
      return badRequest(new MissingParamError('email'));
  }
}
