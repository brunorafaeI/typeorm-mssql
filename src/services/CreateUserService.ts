import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import AppError from '../_errors/AppError';

/**
 * [x] Recebimento das informações
 * [x] Tratativa de erros/excessões
 * [x] Acesso ao respositorio
 */

/**
 * Dependecy inversion
 */

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedpass = await hash(password, 8);
    const user = userRepository.create({
      name,
      email,
      password: hashedpass,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
