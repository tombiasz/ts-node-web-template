import { DomainError } from '@app/core';

export class InvalidSellerIdError extends DomainError {
  message = 'invalid seller id';
}
