import { TimeProvider } from '@utils/timeProvider';
import { HandlerFactory } from '../../shared/handler';
import { createAuctionsRepository } from '@database/auction';
import { RegisterAuction, RegisterAuctionData } from '@app/auctions/useCases';
import { RegisterAuctionHandler } from './registerAuctionHandler';
import { UseCaseWithTransaction } from '@database/core/useCaseWithTransaction';
import { db } from '@database/core';
import { Auction } from '@app/auctions/domain/auction';

export const registerAuctionHandlerFactory: HandlerFactory<RegisterAuctionHandler> = (
  req,
) => {
  const logger = req.logger;

  const useCase = new UseCaseWithTransaction<RegisterAuctionData, Auction>({
    db,
    useCase: new RegisterAuction({
      auctionRepo: createAuctionsRepository({ logger }),
      logger: logger.withContext({ useCase: RegisterAuction.name }),
      timeProvider: new TimeProvider(),
    }),
  });

  return new RegisterAuctionHandler({
    useCase,
    logger: logger.withContext({ handler: RegisterAuctionHandler.name }),
  });
};
