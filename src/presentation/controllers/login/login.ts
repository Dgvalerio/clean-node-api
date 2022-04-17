import { AccountModel } from '@/domain/models/account';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';

export class LoginController implements Controller {
  async handle(
    httpRequest: HttpRequest<Pick<AccountModel, 'email' | 'password'>>
  ): Promise<HttpResponse> {
    if (!httpRequest.body.email)
      return Promise.resolve(badRequest(new MissingParamError('email')));
    if (!httpRequest.body.password)
      return Promise.resolve(badRequest(new MissingParamError('password')));
  }
}
