import { parseISO, startOfHour } from 'date-fns';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {

  const appointmentRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {

  try {
    const { provider, date } = request.body;
    const parsedDate = startOfHour(parseISO(date));
    const appointmentService = new CreateAppointmentService();
  
    const createdAppointment = await appointmentService.createAppointment({
      provider,
      date: parsedDate
    });
    
    return response.json(createdAppointment);

  } catch (e) {
    response.status(400).json({ error: e.message });
  }

});

export default appointmentsRouter;