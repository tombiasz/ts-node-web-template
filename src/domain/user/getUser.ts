import { UserRepository } from './userRepository';
import { Logger } from '../../logger';
import { User } from './user';

type GetUserProps = {
  userRepo: UserRepository;
  logger: Logger;
};

type GetUserData = {
  id: string;
};

export class GetUser {
  private userRepo: UserRepository;
  private logger: Logger;

  constructor(props: GetUserProps) {
    this.userRepo = props.userRepo;
    this.logger = props.logger;
  }

  public async execute({ id }: GetUserData): Promise<User | null> {
    this.logger.info(`Getting user ${id}`);

    try {
      return this.userRepo.getById(id);
    } catch (error) {
      // TODO: domain error if not found?
      return null;
    }
  }
}
