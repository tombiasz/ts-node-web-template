import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler, BaseProps } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { DB } from '../../../database';

interface GetUserProps extends BaseProps {
  db: DB;
}

class GetUserHandler extends Handler<GetUserProps> {
  private db: DB;

  constructor(props: GetUserProps) {
    super(props);

    this.db = props.db;
  }

  protected async _handle(req: Request) {
    const { id } = req.params;

    try {
      const user = this.db.users.getById(id);

      return this.ok(UserSerializer.one(user));
    } catch (error) {
      this.logger.error('user not found', {
        filename: __filename,
        userId: id,
        error,
      });

      return this.fail(HttpError.notFound('user not found'));
    }
  }
}

export const createGetUserHandler = createHandler(GetUserHandler);
