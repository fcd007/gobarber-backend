import 'reflect-metadata';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listMonthAvailabilityProviders: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
//vamos categorizar os testes
describe('ListProviderMonthAvailable', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listMonthAvailabilityProviders = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  //test to availability month the providers
  it('Shold be able to list the month availability the from month the provider.', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user',
      date: new Date(2020, 10, 30, 8, 0, 0),
    });

    for (let index = 8; index < 18; index++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'provider_id',
        user_id: 'user',
        date: new Date(2020, 11, 30, index, 0, 0),
      });
    }

    const availability = await listMonthAvailabilityProviders.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 12,
    });


    //devemos esperar o array esteja com dados true
    expect(availability).toEqual(expect.arrayContaining([
      { day: 28, available: true },
      { day: 29, available: true },
      { day: 30, available: false },
      { day: 31, available: true },
    ]))
  });
});
