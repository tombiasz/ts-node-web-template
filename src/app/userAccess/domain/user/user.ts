import { Entity } from '../../core/entity';
import { UserId } from './userId';
import { ITimeProvider } from '@app/userAccess/core';
import { UserAlreadyActivatedError } from './errors';
import { UserRole } from './userRole';

interface UserProps {
  id: UserId;
  username: string;
  password: string;
  role: UserRole;
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

  get role() {
    return this.props.role;
  }

  activate() {
    if (this.isActive) {
      throw new UserAlreadyActivatedError();
    }

    this.props.isActive = true;
  }

  public static register(
    props: Pick<UserProps, 'username' | 'password'>,
    timeProvider: ITimeProvider,
  ): User {
    return new this({
      id: UserId.create(),
      createdAt: timeProvider.getCurrentTime(),
      isActive: false,
      role: UserRole.BUYER,
      ...props,
    });
  }

  public static create(
    props: Pick<UserProps, 'username' | 'password'>,
    timeProvider: ITimeProvider,
  ): User {
    return new this({
      id: UserId.create(),
      createdAt: timeProvider.getCurrentTime(),
      isActive: true,
      role: UserRole.BUYER,
      ...props,
    });
  }
}
