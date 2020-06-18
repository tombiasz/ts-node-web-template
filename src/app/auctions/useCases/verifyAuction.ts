import { ILogger } from '../../../logger';
import { ITimeProvider } from '@app/userAccess/core';
import { IAuctionRepository, AuctionId } from '@app/auctions/domain/auction';
import { UseCase } from '@app/core';
import { IAdminContext } from '../domain/admin/adminContext';

export type VerifyAuctionDependencies = {
  adminContext: IAdminContext;
  auctionRepo: IAuctionRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
};

export type VerifyAuctionData = {
  auctionId: AuctionId;
};

export class VerifyAuction extends UseCase<VerifyAuctionData, void> {
  private adminContext: IAdminContext;
  private auctionRepo: IAuctionRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;

  constructor(props: VerifyAuctionDependencies) {
    super();

    this.adminContext = props.adminContext;
    this.auctionRepo = props.auctionRepo;
    this.logger = props.logger;
    this.timeProvider = props.timeProvider;
  }

  public async execute({ auctionId }: VerifyAuctionData) {
    const adminId = this.adminContext.adminId;

    this.logger.info('Verifying auction', {
      auctionId: auctionId.value,
      adminId: adminId.value,
    });

    const auction = await this.auctionRepo.getById(auctionId);

    auction.verify(adminId, this.timeProvider);

    await this.auctionRepo.save(auction);

    this.logger.info('Auction verified', {
      id: auctionId.value,
      adminId: adminId.value,
    });
  }
}
