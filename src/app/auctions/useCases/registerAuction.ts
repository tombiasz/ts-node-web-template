import { ILogger } from '../../../logger';
import { ITimeProvider } from '@app/userAccess/core';
import {
  Auction,
  IAuctionRepository,
  AuctionItem,
  AuctionItemImage,
} from '@app/auctions/domain/auction';
import { UseCase } from '@app/core';
import { ISellerContext } from '../domain/seller/sellerContext';

export type RegisterAuctionDependencies = {
  sellerContext: ISellerContext;
  auctionRepo: IAuctionRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
};

type ImageData = {
  path: string;
  description?: string;
};

export type RegisterAuctionData = {
  title: string;
  description: string;
  startingPrice: number;
  images: ImageData[];
  featuredImage?: ImageData;
};

export class RegisterAuction extends UseCase<RegisterAuctionData, Auction> {
  private sellerContext: ISellerContext;
  private auctionRepo: IAuctionRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;

  constructor(props: RegisterAuctionDependencies) {
    super();

    this.sellerContext = props.sellerContext;
    this.auctionRepo = props.auctionRepo;
    this.logger = props.logger;
    this.timeProvider = props.timeProvider;
  }

  public async execute(data: RegisterAuctionData) {
    this.logger.info('Registering new auction');

    const auction = Auction.register(
      {
        sellerId: this.sellerContext.sellerId,
        auctionItem: new AuctionItem({
          title: data.title,
          description: data.description,
          images: data.images.map((img) => new AuctionItemImage(img)),
          featuredImage: data.featuredImage
            ? new AuctionItemImage(data.featuredImage)
            : null,
        }),
        startingPrice: data.startingPrice,
      },
      this.timeProvider,
    );

    await this.auctionRepo.save(auction);

    this.logger.info('new auction registered', { id: auction.id });

    return auction;
  }
}
