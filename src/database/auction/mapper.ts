import {
  Auction,
  AuctionId,
  AuctionItem,
  AuctionItemImage,
  AuctionStatus,
  AwaitingVerificationSate,
  PreviewSate,
  OngoingState,
  WithdrawnState,
  SoldState,
  AuctionState,
} from '@app/auctions/domain/auction';
import { AuctionModel, AuctionStateModel } from './model';
import { SellerId } from '@app/auctions/domain/seller';

const toDb = (auction: Auction): AuctionModel => {
  let state: AuctionStateModel;

  if (auction.state instanceof AwaitingVerificationSate) {
    state = {
      status: AuctionStatus.AWAITING_VERIFICATION,
      addedAt: auction.state.addedAt,
    };
  } else if (auction.state instanceof WithdrawnState) {
    state = {
      status: AuctionStatus.WITHDRAWN,
      reason: auction.state.reason,
      withdrawnAt: auction.state.withdrawnAt,
      withdrawnBy: auction.state.withdrawnBy.value,
    };
  } else if (auction.state instanceof PreviewSate) {
    state = {
      status: AuctionStatus.PREVIEW,
    };
  } else if (auction.state instanceof OngoingState) {
    state = {
      status: AuctionStatus.ONGOING,
    };
  } else if (auction.state instanceof SoldState) {
    state = {
      status: AuctionStatus.SOLD,
    };
  } else {
    throw new TypeError(
      `Unknown auction state status ${auction.state.constructor.name}`,
    );
  }

  return {
    id: auction.id.value,
    sellerId: auction.sellerId.value,
    title: auction.auctionItem.title,
    description: auction.auctionItem.description,
    images: auction.auctionItem.images.map((img) => ({
      path: img.path,
      description: img.description,
      isFeatured: img.equal(auction.auctionItem.featuredImage),
    })),
    startingPrice: auction.startingPrice,
    state,
    createdAt: auction.createdAt,
  };
};

const toEntity = (dto: AuctionModel): Auction => {
  const images = dto.images.map(
    (img) =>
      new AuctionItemImage({
        path: img.path,
        description: img.description,
      }),
  );

  const featuredImageDto = dto.images.find((img) => img.isFeatured);

  if (featuredImageDto === undefined) {
    throw new TypeError(`Featured image not found in db for auction ${dto.id}`);
  }

  const featuredImage = new AuctionItemImage({
    path: featuredImageDto.path,
    description: featuredImageDto.description,
  });

  const auctionItem = new AuctionItem({
    title: dto.title,
    description: dto.description,
    images,
    featuredImage,
  });

  let state: AuctionState;

  switch (dto.state.status) {
    case AuctionStatus.AWAITING_VERIFICATION:
      state = new AwaitingVerificationSate({
        addedAt: dto.state.addedAt!,
      });
      break;
    case AuctionStatus.PREVIEW:
      state = new PreviewSate();
      break;
    case AuctionStatus.ONGOING:
      state = new OngoingState();
      break;
    case AuctionStatus.WITHDRAWN:
      state = new WithdrawnState({
        reason: dto.state.reason!,
        withdrawnAt: dto.state.withdrawnAt!,
        withdrawnBy: new SellerId(dto.state.withdrawnBy!),
      });
      break;
    case AuctionStatus.SOLD:
      state = new SoldState();
      break;
    default:
      throw new TypeError(`Unknown auction state for auction id ${dto.id}`);
  }

  return new Auction({
    id: new AuctionId(dto.id),
    sellerId: new SellerId(dto.sellerId),
    auctionItem: auctionItem,
    startingPrice: dto.startingPrice,
    state,
    createdAt: dto.createdAt,
  });
};

export const AuctionMapper = {
  toDb,
  toEntity,
};
