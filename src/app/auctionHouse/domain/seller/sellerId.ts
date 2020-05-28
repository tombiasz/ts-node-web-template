import * as uuid from 'uuid';
import { InvalidSellerIdError } from './errors';

export const SELLER_ID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export class SellerId {
  public readonly value: string;

  constructor(value: string) {
    const candidate = this.normalize(value);

    this.validate(candidate);

    this.value = candidate;
  }

  public static create(): SellerId {
    return new this(uuid.v4());
  }

  public toString() {
    return this.value;
  }

  private validate(value: string): void {
    const valid = SELLER_ID_REGEX.test(value);

    if (!valid) {
      throw new InvalidSellerIdError();
    }
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
