import { isEqual, parseISO, startOfHour } from 'date-fns';
import { request, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointments: Appointment[] = [];

appointmentsRouter.get('/', (request, response) => {
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  const appointments = appointmentRepository.find();

  return response.json({appointments});
});

appointmentsRouter.post('/', async (request, response) => {

  const { provider, date } = request.body;
  const parsedDate = startOfHour(parseISO(date));
  const appointmentService = new CreateAppointmentService();

  const createdAppointment = await appointmentService.createAppointment({
    provider,
    date: parsedDate
  });
  return response.json(createdAppointment);
});

export default appointmentsRouter;