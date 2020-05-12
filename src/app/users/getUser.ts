import { ILogger } from '../../logger';
import { User, UserId, IUserRepository, UserNotFoundError } from '@domain/user';
import { UseCase } from '../core';

type GetUserProps = {
  userRepo: IUserRepository;
  logger: ILogger;
};

type GetUserData = {
  id: string;
};

export class GetUser extends UseCase<GetUserData, User> {
  private userRepo: IUserRepository;
  private logger: ILogger;

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
