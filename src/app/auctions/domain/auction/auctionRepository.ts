import { Auction } from './auction';
import { AuctionId } from './auctionId';

export interface IAuctionRepository {
  save(auction: Auction): Promise<void>;
  getById(auctionId: AuctionId): Promise<Auction>;
}
