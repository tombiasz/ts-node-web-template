import { Request } from 'express';
import { HttpError } from '../../shared/httpErrors';
import { Handler, createHandler } from '../../shared/handler';
import { UserSerializer } from './serializers';
import { UserRepository } from '../../../domain/user/userRepository';

type GetUserProps = {
  userRepo: UserRepository;
};

export class GetUserHandler extends Handler {
  private userRepo: UserRepository;

  constructor(props: GetUserProps) {
    super();

    this.userRepo = props.userRepo;
  }

  protected async _handle(req: Request) {
    const { id } = req.params;

    try {
      const user = this.userRepo.getById(id);

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
