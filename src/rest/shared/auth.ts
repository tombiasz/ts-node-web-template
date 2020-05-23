import jwt, { Algorithm } from 'jsonwebtoken';
import { AuthenticationResult } from '@app/users';
import { config } from 'src/config';

export interface IAuthTokenCalculator {
  generateToken(payload: object): Promise<string>;
}

export class JwtTokenProvider implements IAuthTokenCalculator {
  async generateToken(auth: AuthenticationResult): Promise<string> {
    return jwt.sign(auth, config.jwtSecret, {
      algorithm: config.jwtAlgorithm as Algorithm,
      expiresIn: config.jwtExpiresIn,
      subject: auth.username,
    });
  }
}
