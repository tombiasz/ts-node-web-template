import { Auction } from './auction';

export interface IAuctionRepository {
  save(auction: Auction): Promise<void>;
}
