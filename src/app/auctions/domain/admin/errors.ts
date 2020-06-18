import { DomainError } from '@app/core';

export class InvalidAdminIdError extends DomainError {
  message = 'invalid admin id';
}
