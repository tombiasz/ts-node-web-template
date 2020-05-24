import jwt, { Algorithm } from 'jsonwebtoken';
import { AuthenticationResult } from '@app/users';
import { config } from 'src/config';

// TODO:
// - fix naming
// - separate authorization interfaces from implementation
// - rethink catalog structure in api/
// - rethink the use of generic Result object

export interface IAuthTokenCalculator {
  generateToken(payload: object): Promise<string>;
}

export interface IAuthTokenVerifier {
  verifyToken(token: string): Promise<TokenVerificationResult>;
}

export type TokenPayload = {
  sub: string;
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

export class JwtTokenProvider
  implements IAuthTokenCalculator, IAuthTokenVerifier {
  async generateToken(auth: AuthenticationResult): Promise<string> {
    return jwt.sign(auth, config.jwtSecret, {
      algorithm: config.jwtAlgorithm as Algorithm,
      expiresIn: config.jwtExpiresIn,
      subject: auth.username,
    });
  }

  async verifyToken(token: string): Promise<TokenVerificationResult> {
    try {
      const payload = await jwt.verify(token, config.jwtSecret);

      return new SuccessfulTokenVerificationResult(payload as TokenPayload);
    } catch (error) {
      return new FailureTokenVerificationResult(error.message);
    }
  }
}
