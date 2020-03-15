import { User } from '../../../domain/user/user';

const one = (user: User) => ({
  id: user.id,
  username: user.username,
});

const list = (users: User[]) => users.map(one);

export const UserSerializer = {
  one,
  list,
};
