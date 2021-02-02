import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import Appointment from "../models/Appointment";
import AppointmentRepository from "../repositories/AppointmentRepository";

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async createAppointment({ provider, date }: Request): Promise<Appointment> {

    const appointmentRepository = getCustomRepository(AppointmentRepository);
    const appointmentDate = startOfHour(date);
    const appointmentInSameDate = await appointmentRepository.findByDate(appointmentDate);

    if(appointmentInSameDate) {
      throw Error('Esse horário não está mais vago.');
    }

    const appointment = appointmentRepository.create({
      provider,
      date: appointmentDate
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;