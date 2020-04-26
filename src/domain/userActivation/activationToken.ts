import * as uuid from 'uuid';
import { DomainError } from '../core/domainError';

export const TOKEN_ID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export class InvalidActivationTokenError extends DomainError {
  message = 'invalid activation token';
}

export class ActivationToken {
  public readonly value: string;

  constructor(value: string) {
    const candidate = this.normalize(value);

    this.validate(candidate);

    this.value = candidate;
  }

  public static create(): ActivationToken {
    return new this(uuid.v4());
  }

  public toString() {
    return this.value;
  }

  private validate(value: string): void {
    const valid = TOKEN_ID_REGEX.test(value);

    if (!valid) {
      throw new InvalidActivationTokenError();
    }
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
