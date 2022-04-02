import app from '@/main/config/app';
import { SignUpDto } from '@/presentation/controllers/signup/signup';

import request from 'supertest';

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    const data: SignUpDto = {
      name: 'Davi',
      email: 'd@v.i',
      password: '123123',
      passwordConfirmation: '123123',
    };

    await request(app).post('/api/signup').send(data).expect(200);
  });
});
