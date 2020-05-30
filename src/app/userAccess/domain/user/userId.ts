import { uuid } from '@app/utils';
import { InvalidUserIdError } from './errors';

export class UserId {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public static generate(): UserId {
    return new this(uuid.generate());
  }

  public static create(value: string): UserId {
    try {
      return new this(uuid.of(value));
    } catch {
      throw new InvalidUserIdError();
    }
  }
}
