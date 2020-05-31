import { Entity } from '@app/core';
import { AuctionId } from './auctionId';
import { SellerId } from '../seller/sellerId';
import { ITimeProvider } from '@app/userAccess/core';

interface AuctionProps {
  id: AuctionId;
  sellerId: SellerId;
  title: string;
  description: string;
  createdAt: Date;
}

export class Auction extends Entity<AuctionProps> {
  get id() {
    return this.props.id;
  }

  get sellerId() {
    return this.props.sellerId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Omit<AuctionProps, 'id'>,
    timeProvider: ITimeProvider,
  ): Auction {
    return new Auction({
      ...props,
      id: AuctionId.generate(),
      createdAt: timeProvider.getCurrentTime(),
    });
  }
}
