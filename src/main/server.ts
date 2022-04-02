import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';
import env from '@/main/config/env';

(async () => {
  try {
    await MongoHelpers.connect(env.mongoUrl);

    const app = (await import('@/main/config/app')).default;

    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    );
  } catch (e) {
    console.error(e);
  }
})();
