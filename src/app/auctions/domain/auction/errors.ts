import { DomainError } from '@app/core';

export class InvalidAuctionIdError extends DomainError {
  message = 'invalid auction id';
}

export class InvalidAuctionItemImageError extends DomainError {
  message = 'invalid auction item image';
}

// TODO: use Rule object to encapsulate MAX_IMAGES check and error in one place
export class MaxNumberOfImagesReachedError extends DomainError {
  message = 'maximum number of images reached';
}

export class AuctionCannotBeWithdrawnError extends DomainError {
  message = 'auction cannot be withdrawn';
}

// TODO: would be nice to have general not found error
export class AuctionNotFoundError extends DomainError {
  message = 'auction not found';
}
