import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm//entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}
/*
* Dependency Inversion (SOLID)
*/
//obrigatório para colocar para injeção de dependencias
@injectable()
class CreateAppointmentService {
  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    ) {}

  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {

  const appointmentDate =  startOfHour(date);

  //compare se a data appointmentDate é anterior a data atual
  if(isBefore(appointmentDate, Date.now())) {
    throw new AppError('You can\'t create an appointment on a past date.');
  }

  if(user_id === provider_id) {
    throw new AppError('You can\'t create an appointment with yourself');
  }

  if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
    throw new AppError('You can only create appoitments between 8am and 5pm');
  }

  const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
    appointmentDate,
  );

  if(findAppointmentInSameDate) {
    throw new AppError('This appointment os alread booked');
  }

  const appointment = await this.appointmentsRepository.create({
    provider_id,
    user_id,
    date: appointmentDate,
  });

  //preparar a data de agendamento
  const dateNewAppointment = format(appointmentDate, 'dd-MM-yyyy \à\s HH:mm');
  await this.notificationsRepository.create({
    content: provider_id,
    recipient_id: `Novo agendamento para a data ${dateNewAppointment}`,
  });

  return appointment;
  }
}

export default CreateAppointmentService;
