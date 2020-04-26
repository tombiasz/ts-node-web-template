import { ActivationToken } from './activationToken';
import { Entity } from '../core/entity';
import { UserId } from '../user/userId';

interface ITimeProvider {
  getCurrentTime: () => Date;
}

interface UserRegistrationData {
  userId: UserId;
  token: ActivationToken;
  createdAt: Date;
  usedOn: Date | null;
}

export class UserRegistration extends Entity<UserRegistrationData> {
  get token() {
    return this.props.token;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get usedOn() {
    return this.props.userId;
  }

  public static create(
    data: Pick<UserRegistrationData, 'userId'>,
    timeProvider: ITimeProvider,
  ): UserRegistration {
    return new this({
      token: ActivationToken.create(),
      userId: data.userId,
      createdAt: timeProvider.getCurrentTime(),
      usedOn: null,
    });
  }
}
