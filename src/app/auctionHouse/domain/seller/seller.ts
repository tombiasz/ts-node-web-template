import { Entity } from '@app/core';
import { SellerId } from './sellerId';

interface SellerProps {
  id: SellerId;
}

export class Seller extends Entity<SellerProps> {
  get id() {
    return this.props.id;
  }
}
