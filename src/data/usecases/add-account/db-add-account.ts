import {
  Encrypter,
  AccountModel,
  AddAccount,
  AddAccountModel,
} from '@/data/usecases/add-account/db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return Promise.resolve(null);
  }
}
