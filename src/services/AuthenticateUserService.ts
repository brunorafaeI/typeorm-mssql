import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import User from '../models/User';
import AppError from '../_errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorect email/password combination.', 401);
    }

    const checkPassword = compare(password, user.password);

    if (!checkPassword) {
      throw new AppError('Incorect email/password combination.', 401);
    }

    delete user.password;

    const { secret_api, expiresIn } = authConfig.jwt;

    const token = sign({}, secret_api, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
