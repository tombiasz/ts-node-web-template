import { Entity } from '../core/entity';
import { UserId } from './userId';
import { ITimeProvider } from '@domain/core';

interface UserProps {
  id: UserId;
  username: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  get id() {
    return this.props.id;
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get isActive() {
    return this.props.isActive;
  }

  public static register(
    props: Pick<UserProps, 'username' | 'password'>,
    timeProvider: ITimeProvider,
  ): User {
    return new this({
      id: UserId.create(),
      createdAt: timeProvider.getCurrentTime(),
      isActive: false,
      ...props,
    });
  }
}
