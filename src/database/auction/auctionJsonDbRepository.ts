import { ILogger } from '../../logger';
import {
  Auction,
  AuctionId,
  IAuctionRepository,
  AuctionNotFoundError,
} from '@app/auctions/domain/auction';
import { DbSession, db } from '../core/dbSession';
import { AuctionMapper } from './mapper';

const AUCTIONS_KEY = '/auction';

type RepositoryProps = {
  db: DbSession;
  logger: ILogger;
};

export class AuctionJsonDbRepository implements IAuctionRepository {
  private db: DbSession;
  private logger: ILogger;

  constructor({ db, logger }: RepositoryProps) {
    this.db = db;
    this.logger = logger;
  }

  async getById(id: AuctionId): Promise<Auction> {
    this.logger.debug('Getting auction', { id: id.value });

    try {
      const data = this.db.getData(this.createKey(id.value));

      return AuctionMapper.toEntity(data);
    } catch (error) {
      this.logger.error('Error when getting auction', {
        error,
        id: id.value,
      });

      throw new AuctionNotFoundError();
    }
  }

  async save(auction: Auction): Promise<void> {
    this.logger.debug(`Saving new auction ${auction.id.value}`);

    const data = AuctionMapper.toDb(auction);

    this.db.push(this.createKey(data.id), data);
  }

  private createKey(...bits: string[]) {
    return [AUCTIONS_KEY, ...bits].join('/');
  }
}

export const createAuctionsRepository = ({ logger }: { logger: ILogger }) =>
  new AuctionJsonDbRepository({
    db,
    logger: logger.withContext({ repo: AuctionJsonDbRepository.name }),
  });
