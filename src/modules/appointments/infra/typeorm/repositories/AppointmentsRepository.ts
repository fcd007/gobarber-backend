import { getRepository, Repository, Raw } from 'typeorm';

import Appointment from '../entities/Appointment';
//fazendo a importação da interface appointamentsRepositoty
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentTDO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  //criando uma variável para Repository
  private ormRepository: Repository<Appointment>;
  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findByDate(date: Date): Promise<Appointment | undefined>{
    const findAppointment = await this.ormRepository.findOne({
      where: { date: date},
    });

    return findAppointment;
  }

  public async findAllMonthProviders({
    provider_id,
    month,
    year,
  }: IFindAllInMonthProviderDTO): Promise<Appointment[]>{
    //criando uma forma de deixar os meses no formato 01 até 12
    const paserMonth = String(month).padStart(2,'0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${month}_${year}'`,
        ),
      },
    })
    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]>{
    //criando uma forma de deixar a data no formato 01 até 09
    const paserDay = String(day).padStart(2,'0');
    const paserMonth = String(month).padStart(2,'0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        day,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${paserDay}-${paserMonth}_${year}'`,
        ),
      },
    })
    return appointments;
  }

  //definindo e implementando o método create com base na interface
  public async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentTDO ): Promise<Appointment>{
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });
    //realizando a operação de save() do typeorm
    await this.ormRepository.save(appointment);
    //retornando o repositório creado
    return appointment;
  }
}

export default AppointmentsRepository;
