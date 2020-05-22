export interface IAuthTokenCalculator {
  generateToken(payload: object): Promise<string>;
}

export class JwtTokenProvider implements IAuthTokenCalculator {
  async generateToken(payload: object): Promise<string> {
    return 'test-token';
  }
}
