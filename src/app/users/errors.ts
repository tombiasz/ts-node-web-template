import { DomainError } from '@domain/core';

export class TokenDoesNotExistError extends DomainError {
  message = 'token does not exist';
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
