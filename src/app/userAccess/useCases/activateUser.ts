import { ILogger } from '../../../logger';
import { ITimeProvider } from '@app/userAccess/core';
import { IUserRepository } from '@app/userAccess/domain/user';
import {
  IUserActivationRepository,
  ActivationToken,
} from '@app/userAccess/domain/userActivation';
import { UseCase } from '@app/core';

export type ActivateUserProps = {
  userRepo: IUserRepository;
  userActivationRepo: IUserActivationRepository;
  timeProvider: ITimeProvider;
  logger: ILogger;
};

export type ActivateUserData = {
  token: string;
};

export class ActivateUser extends UseCase<ActivateUserData, void> {
  private userRepo: IUserRepository;
  private userActivationRepo: IUserActivationRepository;
  private timeProvider: ITimeProvider;
  private logger: ILogger;

  constructor(props: ActivateUserProps) {
    super();

    this.userRepo = props.userRepo;
    this.userActivationRepo = props.userActivationRepo;
    this.timeProvider = props.timeProvider;
    this.logger = props.logger;
  }

  public async execute({ token }: ActivateUserData) {
    this.logger.info('Activating user');

    const userActivation = await this.userActivationRepo.getByToken(
      new ActivationToken(token),
    );
    const user = await this.userRepo.getById(userActivation.userId);

    userActivation.confirm(this.timeProvider);
    user.activate();

    await this.userRepo.save(user);
    await this.userActivationRepo.save(userActivation);

    this.logger.info('User activated', { id: user.id });
  }
}
