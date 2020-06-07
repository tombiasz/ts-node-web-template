import { ILogger } from '../../../logger';
import { ITimeProvider } from '@app/userAccess/core';
import { SellerId } from '@app/auctions/domain/seller';
import {
  Auction,
  IAuctionRepository,
  AuctionItem,
  AuctionItemImage,
} from '@app/auctions/domain/auction';
import { UseCase } from '@app/core';

export type RegisterAuctionDependencies = {
  auctionRepo: IAuctionRepository;
  logger: ILogger;
  timeProvider: ITimeProvider;
};

type ImageData = {
  path: string;
  description?: string;
};

export type RegisterAuctionData = {
  sellerId: string;
  title: string;
  description: string;
  startingPrice: number;
  images: ImageData[];
  featuredImage?: ImageData;
};

export class RegisterAuction extends UseCase<RegisterAuctionData, Auction> {
  private auctionRepo: IAuctionRepository;
  private logger: ILogger;
  private timeProvider: ITimeProvider;

  constructor(props: RegisterAuctionDependencies) {
    super();

    this.auctionRepo = props.auctionRepo;
    this.logger = props.logger;
    this.timeProvider = props.timeProvider;
  }

  public async execute(data: RegisterAuctionData) {
    this.logger.info('Registering new auction');

    const auction = Auction.register(
      {
        sellerId: SellerId.create(data.sellerId),
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
