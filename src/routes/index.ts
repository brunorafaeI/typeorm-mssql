import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import security from '../middlewares/security';

const routes = Router();

routes.use(security);
routes.use('/sessions', sessionsRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);

export default routes;
