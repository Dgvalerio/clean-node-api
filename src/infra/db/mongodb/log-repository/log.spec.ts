import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';
import { LogMongoErrorRepository } from '@/infra/db/mongodb/log-repository/log';

import { Collection } from 'mongodb';

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelpers.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    errorCollection = await MongoHelpers.getCollection('errors');

    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelpers.disconnect();
  });

  const makeSut = (): LogMongoErrorRepository => new LogMongoErrorRepository();

  test('Should create an error log on success', async () => {
    const sut = makeSut();

    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
