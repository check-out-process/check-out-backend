import { verify } from 'jsonwebtoken';

export const getUserDecoded = (token: string) => {
    return verify(token, process.env.ACCESS_TOKEN_SECRET);
}
