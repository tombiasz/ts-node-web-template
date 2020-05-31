import { uuid } from '@app/utils';
import { InvalidAuctionIdError } from './errors';

export class AuctionId {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public static generate(): AuctionId {
    return new this(uuid.generate());
  }

  public static create(value: string): AuctionId {
    try {
      return new this(uuid.of(value));
    } catch {
      throw new InvalidAuctionIdError();
    }
  }
}
