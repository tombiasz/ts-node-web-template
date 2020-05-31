import { Entity } from '@app/core';
import { AuctionId } from './auctionId';
import { SellerId } from '../seller/sellerId';

interface AuctionProps {
  id: AuctionId;
  sellerId: SellerId;
}

export class Auction extends Entity<AuctionProps> {
  get id() {
    return this.props.id;
  }

  get sellerId() {
    return this.props.sellerId;
  }
}
