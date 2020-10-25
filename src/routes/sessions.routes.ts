import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import UserRepository from '../repositories/UserRepository';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();
const authenticateUserService = new AuthenticateUserService();

sessionsRouter.get('/', async (request, response) => {
  const userRepository = getCustomRepository(UserRepository);
  const sessions = await userRepository.find();

  return response.json(sessions);
});

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });

  return response.status(201).json({ user, token });
});

export default sessionsRouter;
