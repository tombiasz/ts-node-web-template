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
  withdrawnBy: string;
};

type OngoingStateModel = {
  status: AuctionStatus.ONGOING;
};

type SoldStateModel = {
  status: AuctionStatus.SOLD;
};

type PreviewStateModel = {
  status: AuctionStatus.PREVIEW;
  previewAt: Date;
  previewBy: string;
};

type VerifiedStateModel = {
  status: AuctionStatus.VERIFIED;
  verifiedAt: Date;
  verifiedBy: string;
};

export type AuctionStateModel =
  | AwaitingVerificationStateModel
  | WithdrawnStateModel
  | OngoingStateModel
  | SoldStateModel
  | PreviewStateModel
  | VerifiedStateModel;

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
