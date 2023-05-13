import { HttpException, HttpStatus } from "@nestjs/common";
import { verify } from "jsonwebtoken";

const verifyRefreshToken = (refreshToken: string, token:string) => {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (token) {
        verify(refreshToken, refreshTokenSecret, (err, tokenDetails) => {
            if (err) {
                throw new HttpException("Invalid refresh token", HttpStatus.NOT_FOUND);
            }
            return tokenDetails;
        });
    } else {
        throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }
};

export { verifyRefreshToken }

