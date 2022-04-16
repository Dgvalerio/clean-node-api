import { LogErrorRepository } from '@/data/protocols/log-error-repository';
import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';

export class LogMongoErrorRepository implements LogErrorRepository {
  async logError(errorStack: string): Promise<void> {
    const errorCollection = await MongoHelpers.getCollection('errors');

    await errorCollection.insertOne({ stack: errorStack, date: new Date() });
  }
}
