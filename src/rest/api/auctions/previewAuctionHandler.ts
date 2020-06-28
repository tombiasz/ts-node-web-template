import { Request } from 'express';
import { Handler } from '../../shared/handler';
import { HttpError } from '../../shared/httpErrors';
import { ILogger } from '../../../logger';
import { UseCase } from '@app/core';
import { PreviewAuctionData } from '@app/auctions/useCases';
import {
  AuctionNotFoundError,
  AuctionId,
  InvalidAuctionIdError,
  OnlyVerifiedAuctionCanBePreview,
  AuctionCanBePreviewOnlyByOwner,
  AuctionCanBeVerifiedWhenInAwaitingVerificationState,
} from '@app/auctions/domain/auction';

type PreviewAuctionHandlerDependencies = {
  useCase: UseCase<PreviewAuctionData, void>;
  logger: ILogger;
};

export class PreviewAuctionHandler extends Handler {
  private useCase: UseCase<PreviewAuctionData, void>;

  private logger: ILogger;

  constructor({ useCase, logger }: PreviewAuctionHandlerDependencies) {
    super();

    this.useCase = useCase;
    this.logger = logger;
  }

  protected async _handle(req: Request) {
    try {
      const auctionId = new AuctionId(req.params.auctionId);

      await this.useCase.execute({ auctionId });

      this.logger.info('auction preview', { id: auctionId.value });

      return this.ok();
    } catch (error) {
      if (
        error instanceof AuctionNotFoundError ||
        error instanceof InvalidAuctionIdError
      ) {
        return this.fail(HttpError.notFound(error.message));
      }

      if (
        error instanceof OnlyVerifiedAuctionCanBePreview ||
        error instanceof AuctionCanBePreviewOnlyByOwner
      ) {
        return this.fail(HttpError.badRequest(error.message));
      }

      throw error;
    }
  }
}
