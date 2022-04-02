import { Encrypter } from '@/data/protocols/encrypter';
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  const encrypterStub: Encrypter = new EncrypterStub();

  const sut = new DbAddAccount(encrypterStub);

  return { sut, encrypterStub };
};

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });
});
