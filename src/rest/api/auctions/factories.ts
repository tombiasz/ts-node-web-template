import { TimeProvider } from '@utils/timeProvider';
import { HandlerFactory } from '../../shared/handler';
import { createAuctionsRepository } from '@database/auction';
import {
  RegisterAuction,
  RegisterAuctionData,
  WithdrawAuction,
  WithdrawAuctionData,
  PreviewAuctionData,
  PreviewAuction,
} from '@app/auctions/useCases';
import { RegisterAuctionHandler } from './registerAuctionHandler';
import { UseCaseWithTransaction } from '@database/core/useCaseWithTransaction';
import { db } from '@database/core';
import { Auction } from '@app/auctions/domain/auction';
import { SellerContext } from './sellerContext';
import { WithdrawAuctionHandler } from './withdrawAuctionHandler';
import { PreviewAuctionHandler } from './previewAuctionHandler';

export const registerAuctionHandlerFactory: HandlerFactory<RegisterAuctionHandler> = (
  req,
) => {
  const logger = req.logger;
  const authUser = req.getAuthorizedUser();

  const useCase = new UseCaseWithTransaction<RegisterAuctionData, Auction>({
    db,
    useCase: new RegisterAuction({
      sellerContext: new SellerContext(authUser),
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

export const withdrawAuctionHandlerFactory: HandlerFactory<WithdrawAuctionHandler> = (
  req,
) => {
  const logger = req.logger;
  const authUser = req.getAuthorizedUser();

  const useCase = new UseCaseWithTransaction<WithdrawAuctionData, void>({
    db,
    useCase: new WithdrawAuction({
      sellerContext: new SellerContext(authUser),
      auctionRepo: createAuctionsRepository({ logger }),
      logger: logger.withContext({ useCase: WithdrawAuction.name }),
      timeProvider: new TimeProvider(),
    }),
  });

  return new WithdrawAuctionHandler({
    useCase,
    logger: logger.withContext({ handler: RegisterAuctionHandler.name }),
  });
};

export const previewAuctionHandlerFactory: HandlerFactory<PreviewAuctionHandler> = (
  req,
) => {
  const logger = req.logger;
  const authUser = req.getAuthorizedUser();

  const useCase = new UseCaseWithTransaction<PreviewAuctionData, void>({
    db,
    useCase: new PreviewAuction({
      sellerContext: new SellerContext(authUser),
      auctionRepo: createAuctionsRepository({ logger }),
      logger: logger.withContext({ useCase: PreviewAuction.name }),
      timeProvider: new TimeProvider(),
    }),
  });

  return new PreviewAuctionHandler({
    useCase,
    logger: logger.withContext({ handler: RegisterAuctionHandler.name }),
  });
};
