import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export interface SignUpDto {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export class SignUpController {
  handle(httpRequest: HttpRequest<SignUpDto>): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }
  }
}
