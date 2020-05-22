import bcrypt from 'bcrypt';
import { config } from 'src/config';
import { IPasswordHashCalculator, IPasswordHashVerifier } from '@domain/core';

export class PasswordManager
  implements IPasswordHashCalculator, IPasswordHashVerifier {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.passwordBcryptRounds);
  }

  public async verifyHashedPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
