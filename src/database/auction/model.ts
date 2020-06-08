import { AuctionStatus } from '@app/auctions/domain/auction';

export type AuctionImageModel = {
  path: string;
  description?: string;
  isFeatured: boolean;
};

type AwaitingVerificationStateModel = {
  status: AuctionStatus.AWAITING_VERIFICATION;
  addedAt: Date;
};

type WithdrawnStateModel = {
  status: AuctionStatus.WITHDRAWN;
  reason: string;
  withdrawnAt: Date;
};

type OngoingStateModel = {
  status: AuctionStatus.ONGOING;
};

type SoldStateModel = {
  status: AuctionStatus.SOLD;
};

type PreviewStateModel = {
  status: AuctionStatus.PREVIEW;
};

export type AuctionStateModel =
  | AwaitingVerificationStateModel
  | WithdrawnStateModel
  | OngoingStateModel
  | SoldStateModel
  | PreviewStateModel;

export type AuctionModel = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  images: AuctionImageModel[];
  state: AuctionStateModel;
  startingPrice: number;
  createdAt: Date;
};
