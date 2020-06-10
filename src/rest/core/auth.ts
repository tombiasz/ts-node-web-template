export type AuthorizedUser = {
  userId: string;
  username: string;
  role: string;
};

export type TokenPayload = AuthorizedUser;

export interface IAuthTokenCalculator {
  generateToken(payload: TokenPayload): Promise<string>;
}

export interface IAuthTokenVerifier {
  verifyToken(token: string): Promise<TokenVerificationResult>;
}

export class SuccessfulTokenVerificationResult {
  public readonly isSuccess = true;
  public readonly authorizedUser: AuthorizedUser;

  constructor(authorizedUser: AuthorizedUser) {
    this.authorizedUser = authorizedUser;
  }
}

export class FailureTokenVerificationResult {
  public readonly isSuccess = false;
  public readonly error: string;

  constructor(error: string) {
    this.error = error;
  }
}

export type TokenVerificationResult =
  | SuccessfulTokenVerificationResult
  | FailureTokenVerificationResult;
