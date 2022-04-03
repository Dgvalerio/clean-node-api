import { DbAddAccount } from '@/data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account';
import { LogControllerDecorator } from '@/main/decorators/log';
import { SignUpController } from '@/presentation/controllers/signup/signup';
import { Controller } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';

export const makeSignUpController = (): Controller => {
  const salt = 12;

  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);

  const emailValidatorAdapter = new EmailValidatorAdapter();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );

  return new LogControllerDecorator(signUpController);
};
