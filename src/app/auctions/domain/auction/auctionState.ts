import { Admin, AdminId } from '../admin';
import { SellerId, Seller } from '../seller';

export enum AuctionStatus {
  AWAITING_VERIFICATION = 'AWAITING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  PREVIEW = 'PREVIEW',
  ONGOING = 'ONGOING',
  SOLD = 'SOLD',
  WITHDRAWN = 'WITHDRAWN',
}

export interface AuctionState {
  readonly status: AuctionStatus;
}

type AwaitingVerificationStateProps = {
  addedAt: Date;
};

export class AwaitingVerificationSate implements AuctionState {
  public readonly status = AuctionStatus.AWAITING_VERIFICATION;
  public readonly addedAt: Date;

  constructor(props: AwaitingVerificationStateProps) {
    this.addedAt = props.addedAt;
  }
}

type VerifiedStateProps = {
  verifiedBy: AdminId;
  verifiedAt: Date;
};

export class VerifiedSate implements AuctionState {
  public readonly status = AuctionStatus.VERIFIED;
  public readonly verifiedBy: AdminId;
  public readonly verifiedAt: Date;

  constructor(props: VerifiedStateProps) {
    this.verifiedAt = props.verifiedAt;
    this.verifiedBy = props.verifiedBy;
  }
}

type PreviewStateProps = {
  previewAt: Date;
  previewBy: SellerId;
};

export class PreviewSate implements AuctionState {
  public readonly status = AuctionStatus.PREVIEW;
  public readonly previewAt: Date;
  public readonly previewBy: SellerId;

  constructor(props: PreviewStateProps) {
    this.previewAt = props.previewAt;
    this.previewBy = props.previewBy;
  }
}

export class OngoingState implements AuctionState {
  public readonly status = AuctionStatus.ONGOING;
}

export class SoldState implements AuctionState {
  public readonly status = AuctionStatus.SOLD;
}

type WithdrawnStateProps = {
  reason: string;
  withdrawnAt: Date;
  withdrawnBy: SellerId;
};

export class WithdrawnState implements AuctionState {
  public readonly status = AuctionStatus.WITHDRAWN;
  public readonly reason: string;
  public readonly withdrawnAt: Date;
  public readonly withdrawnBy: SellerId;

  constructor(props: WithdrawnStateProps) {
    this.reason = props.reason;
    this.withdrawnAt = props.withdrawnAt;
    this.withdrawnBy = props.withdrawnBy;
  }
}
