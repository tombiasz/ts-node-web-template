import { ILogger } from '../../../logger';
import { ITimeProvider } from '@app/userAccess/core';
import { SellerId } from '@app/auctions/domain/seller';
import { IAuctionRepository, AuctionId } from '@app/auctions/domain/auction';
import { UseCase } from '@app/core';
import { ISellerContext } from '../domain/seller/sellerContext';

export type PreviewAuctionDependencies = {
  sellerContext: ISellerContext;
  auctionRepo: IAuctionRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
};

export type PreviewAuctionData = {
  auctionId: AuctionId;
};

export class PreviewAuction extends UseCase<PreviewAuctionData, void> {
  private sellerContext: ISellerContext;
  private auctionRepo: IAuctionRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;

  constructor(props: PreviewAuctionDependencies) {
    super();

    this.sellerContext = props.sellerContext;
    this.auctionRepo = props.auctionRepo;
    this.logger = props.logger;
    this.timeProvider = props.timeProvider;
  }

  public async execute({ auctionId }: PreviewAuctionData) {
    const sellerId = this.sellerContext.sellerId;

    this.logger.info('Previewing auction', {
      auctionId: auctionId.value,
      sellerId: sellerId.value,
    });

    const auction = await this.auctionRepo.getById(auctionId);

    auction.preview(sellerId, this.timeProvider);

    await this.auctionRepo.save(auction);

    this.logger.info('Auction previewed', {
      id: auction.id,
      sellerId: sellerId.value,
    });
  }
}
