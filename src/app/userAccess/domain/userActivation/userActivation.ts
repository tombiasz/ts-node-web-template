import { Entity } from '@app/core';
import { ITimeProvider } from '../../core';
import { UserId } from '../user/userId';
import { ActivationToken } from './activationToken';
import { TokenAlreadyUsedError } from './errors';

interface UserActivationData {
  userId: UserId;
  token: ActivationToken;
  createdAt: Date;
  usedOn: Date | null;
}

export class UserActivation extends Entity<UserActivationData> {
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
    return this.props.usedOn;
  }

  confirm(timeProvider: ITimeProvider) {
    if (this.usedOn) {
      throw new TokenAlreadyUsedError();
    }

    this.props.usedOn = timeProvider.getCurrentTime();
  }

  public static createForUser(
    userId: UserId,
    timeProvider: ITimeProvider,
  ): UserActivation {
    return new this({
      userId: userId,
      token: ActivationToken.create(),
      createdAt: timeProvider.getCurrentTime(),
      usedOn: null,
    });
  }
}
