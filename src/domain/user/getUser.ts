import { UserRepository } from './userRepository';
import { Logger } from '../../logger';
import { User } from './user';
import { UseCase } from '../core/useCase';
import { DomainError } from '../core/domainError';

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
    this.logger = UseCase.extendLoggerWithContext(props.logger);
  }

  public async execute({ id }: GetUserData) {
    this.logger.info(`Getting user ${id}`);

    try {
      return this.userRepo.getById(id);
    } catch (error) {
      throw new UserNotFoundError();
    }
  }
}
