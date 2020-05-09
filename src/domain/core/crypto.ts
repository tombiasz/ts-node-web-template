export interface IPasswordHashCalculator {
  hashPassword(password: string): string;
}

export interface IPasswordHashVerifier {
  verifyHashedPassword(hash: string, password: string): boolean;
}
