import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthrMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const config = process.env;

    const token =req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = verify(token, config.ACCESS_TOKEN_SECRET);
    req['user'] = decoded;
} catch (err) {
    return res.status(401).send("Invalid Token");
  }
    next();
  }
}
