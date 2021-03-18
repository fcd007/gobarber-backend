import 'reflect-metadata';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListproviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listDayAvailabilityProviders: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
//vamos categorizar os testes
describe('ListProviderDayAvailable', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listDayAvailabilityProviders = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  //test to availability month the providers
  it('Shold be able to list the day availability the from provider.', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user',
      date: new Date(2020, 11, 30, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user',
      date: new Date(2020, 11, 30, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 11, 30, 11).getTime();
    });

    const availability = await listDayAvailabilityProviders.execute({
      provider_id: 'provider_id',
      day: 30,
      year: 2020,
      month: 12,
    });


    //devemos esperar o array esteja com dados true
    expect(availability).toEqual(expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
