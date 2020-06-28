import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';
import { VerifyAuctionData } from '@app/auctions/useCases';
import {
  AuctionNotFoundError,
  AuctionId,
  InvalidAuctionIdError,
  AuctionCanBeVerifiedWhenInAwaitingVerificationState,
} from '@app/auctions/domain/auction';

type VerifyAuctionHandlerDependencies = {
  useCase: UseCase<VerifyAuctionData, void>;
  logger: ILogger;
};

export class VerifyAuctionHandler extends Handler {
  private useCase: UseCase<VerifyAuctionData, void>;

  private logger: ILogger;

  constructor({ useCase, logger }: VerifyAuctionHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const auctionId = new AuctionId(req.params.auctionId);

      await this.useCase.execute({ auctionId });

      this.logger.info('verify auction', { id: auctionId.value });

      return this.ok();
    } catch (error) {
      if (
        error instanceof AuctionNotFoundError ||
        error instanceof InvalidAuctionIdError
      ) {
        return this.fail(HttpError.notFound(error.message));
      }

      if (
        error instanceof AuctionCanBeVerifiedWhenInAwaitingVerificationState
      ) {
        return this.fail(HttpError.badRequest(error.message));
      }

      throw error;
    }
  }
}
