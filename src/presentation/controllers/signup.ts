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
    const requiredFields: (keyof SignUpDto)[] = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    const invalidField = requiredFields.find(
      (field) => !httpRequest.body[field]
    );

    if (invalidField) return badRequest(new MissingParamError(invalidField));
  }
}
