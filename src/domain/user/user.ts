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
}
