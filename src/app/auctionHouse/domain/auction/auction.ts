import { Entity } from '@app/core';
import { AuctionId } from './auctionId';
import { SellerId } from '../seller/sellerId';
import { ITimeProvider } from '@app/userAccess/core';
import { AuctionItem } from './auctionItem';
import { AuctionCannotBeWithdrawnError } from './errors';
import {
  AuctionState,
  AwaitingVerificationSate,
  PreviewSate,
  WithdrawnState,
} from './auctionState';

interface AuctionProps {
  id: AuctionId;
  sellerId: SellerId;
  auctionItem: AuctionItem;
  startingPrice: number;
  state: AuctionState;
  createdAt: Date;
}

export class Auction extends Entity<AuctionProps> {
  private _state: AuctionState;

  constructor(props: AuctionProps) {
    super(props);

    this._state = props.state;
  }

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
    return this._state;
  }

  canBeWithdrawn(): boolean {
    return (
      this.state instanceof AwaitingVerificationSate ||
      this.state instanceof PreviewSate
    );
  }

  withdraw(reason: string, timeProvider: ITimeProvider): void {
    if (!this.canBeWithdrawn()) {
      throw new AuctionCannotBeWithdrawnError();
    }

    this._state = new WithdrawnState({
      reason,
      withdrawnAt: timeProvider.getCurrentTime(),
    });
  }

  static register(
    props: Omit<AuctionProps, 'id' | 'state' | 'createdAt'>,
    timeProvider: ITimeProvider,
  ): Auction {
    return new Auction({
      ...props,
      id: AuctionId.generate(),
      state: new AwaitingVerificationSate(),
      createdAt: timeProvider.getCurrentTime(),
    });
  }
}
