import { DomainError } from '@app/core';
import { AuctionItem } from './auctionItem';

export class InvalidAuctionIdError extends DomainError {
  message = 'invalid auction id';
}

export class InvalidAuctionItemImageError extends DomainError {
  message = 'invalid auction item image';
}

export class MaxNumberOfImagesReachedError extends DomainError {
  message = `maximum number (${AuctionItem.MAX_IMAGES}) of images reached`;
}

export class AuctionCannotBeWithdrawnError extends DomainError {
  message = 'auction cannot be withdrawn';
}

// TODO: would be nice to have general not found error
export class AuctionNotFoundError extends DomainError {
  message = 'auction not found';
}
