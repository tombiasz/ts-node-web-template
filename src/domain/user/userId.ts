import * as uuid from 'uuid';
import { InvalidUserIdError } from './errors';

export const USER_ID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export class UserId {
  public readonly value: string;

  constructor(value: string) {
    const candidate = this.normalize(value);

    this.validate(candidate);

    this.value = candidate;
  }

  public static create(): UserId {
    return new this(uuid.v4());
  }

  public toString() {
    return this.value;
  }

  private validate(value: string): void {
    const valid = USER_ID_REGEX.test(value);

    if (!valid) {
      throw new InvalidUserIdError();
    }
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
