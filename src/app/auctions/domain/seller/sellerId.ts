import { uuid } from '@app/utils';
import { InvalidSellerIdError } from './errors';

export class SellerId {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public static generate(): SellerId {
    return new this(uuid.generate());
  }

  public static create(value: string): SellerId {
    try {
      return new this(uuid.of(value));
    } catch {
      throw new InvalidSellerIdError();
    }
  }
}
