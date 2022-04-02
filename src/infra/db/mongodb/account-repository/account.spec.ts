import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account';
import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelpers.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const accountCollection = MongoHelpers.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelpers.disconnect();
  });

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  test('Should return an account on success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toEqual('any_name');
    expect(account.email).toEqual('any_email@mail.com');
    expect(account.password).toEqual('any_password');
  });
});
