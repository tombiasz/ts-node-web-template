import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { AuctionSerializer } from './serializers';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';
import { RegisterAuctionData } from '@app/auctions/useCases/registerAuction';
import { Auction, AuctionNotFoundError } from '@app/auctions/domain/auction';

type RegisterAuctionHandlerDependencies = {
  useCase: UseCase<RegisterAuctionData, Auction>;
  logger: ILogger;
};

export class RegisterAuctionHandler extends Handler {
  private useCase: UseCase<RegisterAuctionData, Auction>;

  private logger: ILogger;

  constructor({ useCase, logger }: RegisterAuctionHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const auction = await this.useCase.execute(req.body);

      this.logger.info('new auction created', { id: auction.id.value });

      return this.ok(AuctionSerializer.one(auction));
    } catch (error) {
      if (error instanceof AuctionNotFoundError) {
        return this.fail(HttpError.notFound(error.message));
      }

      throw error;
    }
  }
}
