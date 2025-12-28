export interface TokenPayload {
      userId: number;
      username: string;
      role?: string;
}

export interface ITokenGenerator {
  generate(payload: TokenPayload): string;
  verify(token: string): boolean;
}
