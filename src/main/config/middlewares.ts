import { bodyParser } from '@/main/config/middlewares/body-parser';

import { Express } from 'express';

export default (app: Express): void => {
  app.use(bodyParser);
};
