import { ILogger } from '../../../logger';
import { ITimeProvider } from '@app/userAccess/core';
import { SellerId } from '@app/auctions/domain/seller';
import { IAuctionRepository, AuctionId } from '@app/auctions/domain/auction';
import { UseCase } from '@app/core';
import { ISellerContext } from '../domain/seller/sellerContext';

export type WithdrawAuctionDependencies = {
  sellerContext: ISellerContext;
  auctionRepo: IAuctionRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
};

export type WithdrawAuctionData = {
  sellerId: SellerId;
  auctionId: AuctionId;
  reason: string;
};

export class WithdrawAuction extends UseCase<WithdrawAuctionData, void> {
  private sellerContext: ISellerContext;
  private auctionRepo: IAuctionRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;

  constructor(props: WithdrawAuctionDependencies) {
    super();

    this.sellerContext = props.sellerContext;
    this.auctionRepo = props.auctionRepo;
    this.logger = props.logger;
    this.timeProvider = props.timeProvider;
  }

  public async execute({ auctionId, reason }: WithdrawAuctionData) {
    const sellerId = this.sellerContext.sellerId;

    this.logger.info('Withdrawing auction', {
      auctionId: auctionId.value,
      sellerId: sellerId.value,
    });

    const auction = await this.auctionRepo.getById(auctionId);

    auction.withdraw(sellerId, reason, this.timeProvider);

    await this.auctionRepo.save(auction);

    this.logger.info('Auction withdrawn', {
      id: auction.id,
      sellerId: sellerId.value,
    });
  }
}
