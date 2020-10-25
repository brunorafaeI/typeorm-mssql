import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import './database';
import AppError from './_errors/AppError';

const app = express();

app.use('/files', express.static(uploadConfig.directory));
app.use(express.json());
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, __: NextFunction) => {
    if (error instanceof AppError) {
      const { statusCode, message } = error;

      return response.status(statusCode).json({
        statusCode,
        message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error 500.',
    });
  },
);

const SERVER_PORT = process.env.SERVER_PORT || 3333;

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Server started on port ${SERVER_PORT}`);
});
