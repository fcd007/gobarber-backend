import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

//SOLID - using dependency inversion
import IAppointmentsRepository  from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {
  }

  public async execute({
    provider_id,
    month,
    year
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllMonthProviders({
      provider_id,
      month,
      year,
    });
    //obtendo o número de dias para cada mês
    const numberDaysOfMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberDaysOfMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointments => {
        return getDate(appointments.date)  === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
