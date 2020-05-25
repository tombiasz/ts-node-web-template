export interface IAuthTokenCalculator {
  generateToken(payload: TokenPayload): Promise<string>;
}

export interface IAuthTokenVerifier {
  verifyToken(token: string): Promise<TokenVerificationResult>;
}

export type TokenPayload = {
  userId: string;
  username: string;
};

export class SuccessfulTokenVerificationResult {
  public readonly isSuccess = true;
  public readonly payload: TokenPayload;

  constructor(payload: TokenPayload) {
    this.payload = payload;
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
