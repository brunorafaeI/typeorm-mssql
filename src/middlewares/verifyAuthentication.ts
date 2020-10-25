import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function verifyAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validation of token JWT
  const { authorization } = request.headers;

  if (!authorization) {
    throw new Error('JWT token is missing', 401);
  }

  // Token Bearer
  const [, token] = authorization.split(' ');
  const { secret_api } = authConfig.jwt;

  try {
    const decodedToken = verify(token, secret_api);
    const { sub } = decodedToken as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token', 401);
  }
}
