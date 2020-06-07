enum AuctionStatus {
  AWAITING_VERIFICATION = 'AWAITING_VERIFICATION',
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

export class PreviewSate implements AuctionState {
  public readonly status = AuctionStatus.PREVIEW;
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
};

export class WithdrawnState implements AuctionState {
  public readonly status = AuctionStatus.WITHDRAWN;
  public readonly reason: string;
  public readonly withdrawnAt: Date;

  constructor(props: WithdrawnStateProps) {
    this.reason = props.reason;
    this.withdrawnAt = props.withdrawnAt;
  }
}