import { HttpException, HttpStatus } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const getUserDecoded = (token: string) => {
    try {
        return verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new HttpException("invalid token", HttpStatus.UNAUTHORIZED);
      }
}
