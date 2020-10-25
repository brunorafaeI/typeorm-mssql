import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';

import uploadConcig from '../config/upload';
import UserRepository from '../repositories/UserRepository';
import User from '../models/User';
import AppError from '../_errors/AppError';

interface Request {
  user_id: string;
  avatar: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatar }: Request): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError(
        `You don't have permission to change this avatar`,
        401,
      );
    }

    if (user.avatar) {
      const userAvatarPath = path.join(uploadConcig.directory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarPath);

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarPath);
      }
    }

    user.avatar = avatar;
    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
