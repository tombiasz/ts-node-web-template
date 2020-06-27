import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';
import { WithdrawAuctionData } from '@app/auctions/useCases';
import {
  AuctionNotFoundError,
  AuctionCanBeWithdrawnOnlyByOwner,
  AuctionCannotBeWithdrawnError,
  AuctionId,
  InvalidAuctionIdError,
} from '@app/auctions/domain/auction';

type WithdrawAuctionHandlerDependencies = {
  useCase: UseCase<WithdrawAuctionData, void>;
  logger: ILogger;
};

export class WithdrawAuctionHandler extends Handler {
  private useCase: UseCase<WithdrawAuctionData, void>;

  private logger: ILogger;

  constructor({ useCase, logger }: WithdrawAuctionHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const auctionId = new AuctionId(req.params.auctionId);
      const { reason } = req.body;

      await this.useCase.execute({
        auctionId,
        reason,
      });

      this.logger.info('auction withdrawn', { id: auctionId.value });

      return this.ok();
    } catch (error) {
      if (
        error instanceof AuctionNotFoundError ||
        error instanceof InvalidAuctionIdError
      ) {
        return this.fail(HttpError.notFound(error.message));
      }

      if (
        error instanceof AuctionCanBeWithdrawnOnlyByOwner ||
        error instanceof AuctionCannotBeWithdrawnError
      ) {
        return this.fail(HttpError.badRequest(error.message));
      }

      throw error;
    }
  }
}
