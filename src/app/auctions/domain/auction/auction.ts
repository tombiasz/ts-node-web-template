import { Entity } from '@app/core';
import { AuctionId } from './auctionId';
import { SellerId } from '../seller/sellerId';
import { ITimeProvider } from '@app/userAccess/core';
import { AuctionItem } from './auctionItem';
import {
  AuctionCannotBeWithdrawnError,
  AuctionCanBeVerifiedWhenInAwaitingVerificationState,
} from './errors';
import {
  AuctionState,
  AwaitingVerificationSate,
  PreviewSate,
  WithdrawnState,
  VerifiedSate,
} from './auctionState';
import { AdminId } from '../admin';
import { time } from 'console';

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

  get auctionItem() {
    return this.props.auctionItem;
  }

  get startingPrice() {
    return this.props.startingPrice;
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

  isAwaitingVerification(): boolean {
    return this.state instanceof AwaitingVerificationSate;
  }

  verify(adminId: AdminId, timeProvider: ITimeProvider): void {
    if (!this.isAwaitingVerification()) {
      throw new AuctionCanBeVerifiedWhenInAwaitingVerificationState();
    }

    this._state = new VerifiedSate({
      verifiedBy: adminId,
      verifiedAt: timeProvider.getCurrentTime(),
    });
  }

  static register(
    props: Omit<AuctionProps, 'id' | 'state' | 'createdAt'>,
    timeProvider: ITimeProvider,
  ): Auction {
    const now = timeProvider.getCurrentTime();

    return new Auction({
      ...props,
      id: AuctionId.generate(),
      state: new AwaitingVerificationSate({ addedAt: now }),
      createdAt: now,
    });
  }
}
