import { Entity } from '../core/entity';
import { UserId } from './userId';

interface UserProps {
  id: UserId;
  username: string;
  password: string;
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

  public static register(props: Omit<UserProps, 'id'>): User {
    return new this({
      id: UserId.create(),
      ...props,
    });
  }
}
