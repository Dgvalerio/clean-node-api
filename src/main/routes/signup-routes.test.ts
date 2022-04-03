import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';
import app from '@/main/config/app';
import { SignUpDto } from '@/presentation/controllers/signup/signup';

import request from 'supertest';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelpers.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelpers.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelpers.disconnect();
  });

  test('Should return an account on success', async () => {
    const data: SignUpDto = {
      name: 'Davi',
      email: 'davi@gmail.com',
      password: '123123',
      passwordConfirmation: '123123',
    };

    await request(app).post('/api/signup').send(data).expect(200);
  });
});
