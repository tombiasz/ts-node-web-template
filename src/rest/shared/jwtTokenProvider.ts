import jwt, { Algorithm } from 'jsonwebtoken';
import { config } from 'src/config';
import {
  IAuthTokenCalculator,
  IAuthTokenVerifier,
  TokenPayload,
  TokenVerificationResult,
  SuccessfulTokenVerificationResult,
  FailureTokenVerificationResult,
} from '../core/auth';

export class JwtTokenProvider
  implements IAuthTokenCalculator, IAuthTokenVerifier {
  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, config.jwtSecret, {
      algorithm: config.jwtAlgorithm as Algorithm,
      expiresIn: config.jwtExpiresIn,
      subject: payload.userId,
    });
  }

  async verifyToken(token: string): Promise<TokenVerificationResult> {
    try {
      const payload = await jwt.verify(token, config.jwtSecret);

      const { userId, username } = payload as TokenPayload;

      return new SuccessfulTokenVerificationResult({
        userId,
        username,
      });
    } catch (error) {
      return new FailureTokenVerificationResult(error.message);
    }
  }
}
