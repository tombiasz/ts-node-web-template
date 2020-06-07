import { Auction } from '@app/auctions/domain/auction';

export type SerializedAuction = {
  id: string;
  title: string;
  description: string;
  images: Array<{
    img: string;
    description?: string;
    isFeatured: boolean;
  }>;
  status: string;
  startingPrice: number;
  createdAt: Date;
};

const one = (auction: Auction): SerializedAuction => ({
  id: auction.id.value,
  title: auction.auctionItem.title,
  description: auction.auctionItem.description,
  images: auction.auctionItem.images.map((img) => ({
    img: img.path,
    description: img.description,
    isFeatured: img.equal(auction.auctionItem.featuredImage),
  })),
  startingPrice: auction.startingPrice,
  status: auction.state.status,
  createdAt: auction.createdAt,
});

export const AuctionSerializer = {
  one,
};
