import { Request } from 'express';
import { Handler, createHandler } from '../../shared/handler';
import { User } from '../../../domain/user/user';
import { UserSerializer } from './serializers';
import { Logger } from '../../../logger';
import { DbSession } from '../../../dbSession';
import { UserRepository } from '../../../domain/user/userRepository';

type CreateUserProps = {
  db: DbSession;
  userRepo: UserRepository;
};

export class CreateUserHandler extends Handler {
  private db: DbSession;
  private userRepo: UserRepository;

  constructor(props: CreateUserProps) {
    super();

    this.db = props.db;
    this.userRepo = props.userRepo;
  }

  protected async _handle(req: Request) {
    const { id, username, password } = req.body;

    const user = new User({
      id, // TODO: generate id
      username,
      password, // TODO: password hashing
    });

    this.userRepo.save(user);
    this.db.save();

    this.logger.info('new user created', { id: user.id });

    return this.ok(UserSerializer.one(user));
  }
}

export const createCreateUserHandler = createHandler(CreateUserHandler);
