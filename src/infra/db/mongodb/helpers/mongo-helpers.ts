import { MongoClient, MongoClientOptions, Collection } from 'mongodb';

export const MongoHelpers = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongoClientOptions);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...collectionWithoutId } = collection;

    return { ...collectionWithoutId, id: _id };
  },
};
