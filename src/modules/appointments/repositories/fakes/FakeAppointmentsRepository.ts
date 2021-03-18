import { v4 as uuidv4 } from 'uuid';
import { isEqual, getMonth, getDate, getYear } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
//fazendo a importação da interface appointamentsRepositoty
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentTDO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined>{
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date,date),
    );

    return findAppointment;
  }

  public async findAllMonthProviders({
    provider_id,
    month,
    year,
  }: IFindAllInMonthProviderDTO): Promise<Appointment[]>{
    const appointments = this.appointments.filter(
      appointment => {
        return (
          appointment.provider_id  === provider_id &&
          getMonth(appointment.date) + 1 === month &&
          getYear(appointment.date) === year
        );
      });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]>{
    const appointments = this.appointments.filter(
      appointment => {
        return (
          appointment.provider_id  === provider_id &&
          getDate(appointment.date) === day &&
          getMonth(appointment.date) + 1 === month &&
          getYear(appointment.date) === year
        );
      });

    return appointments;
  }

  //definindo e implementando o método create com base na interface
  public async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentTDO ): Promise<Appointment>{
    const appointment = new Appointment();
    //atribuindo valores ao appointment
    appointment.id = uuidv4();
    appointment.user_id = user_id;
    appointment.date = date;
    appointment.provider_id = provider_id;
    // Object.assign(user { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
