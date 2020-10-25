import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import verifyAuthentication from '../middlewares/verifyAuthentication';

const appointmentsRouter = Router();
const appointmentService = new CreateAppointmentService();

appointmentsRouter.use(verifyAuthentication);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);

  const appointment = await appointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return response.status(201).json(appointment);
});

export default appointmentsRouter;
