import { bodyParser } from '@/main/config/middlewares/body-parser';
import { contentType } from '@/main/config/middlewares/content-type';
import { cors } from '@/main/config/middlewares/cors';

import { Express } from 'express';

export default (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};
