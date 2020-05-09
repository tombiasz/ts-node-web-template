import * as crypto from 'crypto';
import { IPasswordHashCalculator, IPasswordHashVerifier } from '@domain/core';

export class PasswordManager
  implements IPasswordHashCalculator, IPasswordHashVerifier {
  public hashPassword(password: string): string {
    // use bcrypt or similar
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  public verifyHashedPassword(hash: string, password: string): boolean {
    // use binary compare
    return hash === this.hashPassword(password);
  }
}
