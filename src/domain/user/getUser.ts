import { UserRepository } from './userRepository';
import { Logger } from '../../logger';
import { User } from './user';
import { UseCase } from '../core/useCase';
import { DomainError } from '../core/domainError';
import { UserId } from './userId';

type GetUserProps = {
  userRepo: UserRepository;
  logger: Logger;
};

type GetUserData = {
  id: string;
};

export class UserNotFoundError extends DomainError {
  message = 'user not found';
}

export class GetUser extends UseCase<GetUserData, User> {
  private userRepo: UserRepository;
  private logger: Logger;

  constructor(props: GetUserProps) {
    super();

    this.userRepo = props.userRepo;
    this.logger = props.logger;
  }

  public async execute({ id }: GetUserData) {
    const userId = new UserId(id);

    this.logger.info(`Getting user ${userId}`);

    try {
      return this.userRepo.getById(userId);
    } catch (error) {
      throw new UserNotFoundError();
    }
  }
}
