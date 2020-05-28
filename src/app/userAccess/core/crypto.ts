export interface IPasswordHashCalculator {
  hashPassword(password: string): Promise<string>;
}

export interface IPasswordHashVerifier {
  verifyHashedPassword(hash: string, password: string): Promise<boolean>;
}
