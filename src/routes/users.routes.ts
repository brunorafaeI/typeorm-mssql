import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import UserRepository from '../repositories/UserRepository';
import CreateUserService from '../services/CreateUserService';
import verifyAuthentication from '../middlewares/verifyAuthentication';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

// SoC Separation of concept

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.get('/', async (request, response) => {
  const userRepository = getCustomRepository(UserRepository);
  const users = await userRepository.find();

  users.forEach(user => user.password && delete user.password);

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const userService = new CreateUserService();

  const user = await userService.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.status(201).json(user);
});

usersRouter.patch(
  '/avatar',
  verifyAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const { file, user } = request;
    const updateUserAvatarService = new UpdateUserAvatarService();

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatar: file.filename,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  },
);

export default usersRouter;
