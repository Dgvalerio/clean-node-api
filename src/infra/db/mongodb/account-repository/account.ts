import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { MongoHelpers } from '@/infra/db/mongodb/helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelpers.getCollection('accounts');

    await accountCollection.insertOne(account);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...accountWithoutId } = await accountCollection.findOne<
      AddAccountModel & { _id: string }
    >({
      email: account.email,
    });

    return { ...accountWithoutId, id: _id };
  }
}
