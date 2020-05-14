import { UseCase } from '@app/core';
import { DbSession } from './dbSession';

interface Dependencies<TData, TResult> {
  db: DbSession;
  useCase: UseCase<TData, TResult>;
}

export class UseCaseWithTransaction<TData, TResult> extends UseCase<
  TData,
  TResult
> {
  private db: DbSession;

  private useCase: UseCase<TData, TResult>;

  constructor({ db, useCase }: Dependencies<TData, TResult>) {
    super();
    this.db = db;
    this.useCase = useCase;
  }

  async execute(data: TData): Promise<TResult> {
    // start db transaction

    const result = await this.useCase.execute(data);

    // commit
    this.db.save();

    return result;
  }
}
