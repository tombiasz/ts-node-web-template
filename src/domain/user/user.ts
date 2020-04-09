import * as uuid from 'uuid';
import { Entity } from '../core/entity';

interface UserProps {
  id: string;
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

  public static create(props: Omit<UserProps, 'id'>): User {
    return new this({
      id: uuid.v4(),
      ...props,
    });
  }
}
