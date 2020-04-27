import { User } from '@domain/user';

export type SerializedUser = {
  id: string;
  username: string;
};

const one = (user: User): SerializedUser => ({
  id: user.id.value,
  username: user.username,
});

const list = (users: User[]): SerializedUser[] => users.map(one);

export const UserSerializer = {
  one,
  list,
};
