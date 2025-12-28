import {ITokenGenerator, TokenPayload} from '../../../Contracts/ITokenGenerator';
import jwt from 'jsonwebtoken';



export class JwtTokenGenerator implements ITokenGenerator {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }
  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
  }
  verify(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
        return true;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
  }
}