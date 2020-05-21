import bcrypt from 'bcrypt';
import { IPasswordHashCalculator, IPasswordHashVerifier } from '@domain/core';

const BCRYPT_ROUNDS = 15;

export class PasswordManager
  implements IPasswordHashCalculator, IPasswordHashVerifier {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  public async verifyHashedPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
