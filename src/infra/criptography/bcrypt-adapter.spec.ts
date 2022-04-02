import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter';

import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => Promise.resolve('hash'),
}));

const salt = 12;

const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });

  test('Should throws if bcrypt throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
      await Promise.reject(new Error());
    });

    const promise = sut.encrypt('any_value');

    await expect(promise).rejects.toThrow();
  });
});
