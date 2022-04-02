import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelpers.getCollection('accounts');

    await accountCollection.insertOne(account);

    const result = await accountCollection.findOne({
      email: account.email,
    });

    return MongoHelpers.map(result);
  }
}
