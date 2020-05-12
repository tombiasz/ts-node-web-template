import { DomainError } from '@domain/core';

export class TokenNotFoundError extends DomainError {
  message = 'token token not found';
}

export class TokenAlreadyUsedError extends DomainError {
  message = 'token was already used';
}

export class UserAlreadyActivatedError extends DomainError {
  message = 'user was already activated';
}

export class UsernameNotUniqueError extends DomainError {
  message = 'username already taken';
}

export class UserNotFoundError extends DomainError {
  message = 'user not found';
}
