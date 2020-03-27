import { Request } from 'express';
import { Handler, createHandler } from '../../shared/handler';
import { User } from '../../../domain/user/user';
import { UserSerializer } from './serializers';
import { DB } from '../../../database';

type CreateUserProps = {
  db: DB;
};

class CreateUserHandler extends Handler {
  private db: DB;

  constructor(props: CreateUserProps) {
    super();

    this.db = props.db;
  }

  protected async _handle(req: Request) {
    const { id, username, password } = req.body;

    const user = new User({
      id, // TODO: generate id
      username,
      password, // TODO: password hashing
    });

    this.db.users.save(user);

    this.logger.info('new user created', { id: user.id });

    return this.ok(UserSerializer.one(user));
  }
}

export const createCreateUserHandler = createHandler(CreateUserHandler);
