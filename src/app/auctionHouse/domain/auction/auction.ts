import { Entity } from '@app/core';
import { AuctionId } from './auctionId';
import { SellerId } from '../seller/sellerId';
import { ITimeProvider } from '@app/userAccess/core';
import { AuctionItem } from './auctionItem';

enum AuctionState {
  AWAITING_VERIFICATION = 'AWAITING_VERIFICATION',
  PREVIEW = 'PREVIEW',
  ONGOING = 'ONGOING',
  SOLD = 'SOLD',
  WITHDRAWN = 'WITHDRAWN',
}

interface AuctionProps {
  id: AuctionId;
  sellerId: SellerId;
  auctionItem: AuctionItem;
  startingPrice: number;
  state: AuctionState;
  createdAt: Date;
}

export class Auction extends Entity<AuctionProps> {
  get id() {
    return this.props.id;
  }

  get sellerId() {
    return this.props.sellerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get state() {
    return this.props.state;
  }

  static register(
    props: Omit<AuctionProps, 'id' | 'state' | 'createdAt'>,
    timeProvider: ITimeProvider,
  ): Auction {
    return new Auction({
      ...props,
      id: AuctionId.generate(),
      state: AuctionState.AWAITING_VERIFICATION,
      createdAt: timeProvider.getCurrentTime(),
    });
  }
}
