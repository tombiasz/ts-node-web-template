import { DomainError } from '@app/core';

export class TokenNotFoundError extends DomainError {
  message = 'token token not found';
}

export class TokenAlreadyUsedError extends DomainError {
  message = 'token was already used';
}

export class InvalidActivationTokenError extends DomainError {
  message = 'invalid activation token';
}
