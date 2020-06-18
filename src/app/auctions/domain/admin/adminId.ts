import { uuid } from '@app/utils';
import { InvalidAdminIdError } from './errors';

export class AdminId {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public static generate(): AdminId {
    return new this(uuid.generate());
  }

  public static create(value: string): AdminId {
    try {
      return new this(uuid.of(value));
    } catch {
      throw new InvalidAdminIdError();
    }
  }
}
