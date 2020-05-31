import { DomainError } from '@app/core';

export class InvalidAuctionIdError extends DomainError {
  message = 'invalid auction id';
}
