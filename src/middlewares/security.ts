import { Request, Response, NextFunction } from 'express';

export default function security(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { method, url, ip } = request;
  const { authorization } = request.headers;

  console.log({ method, url, ip });

  return next();
}
