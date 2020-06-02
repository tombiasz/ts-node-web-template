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
