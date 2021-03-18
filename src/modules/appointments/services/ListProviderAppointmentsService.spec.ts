import 'reflect-metadata';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
//vamos categorizar os testes
describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  //test to availability month the providers
  it('Shold be able to list the appointments on a specific day.', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 1, 10, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 1, 10, 10, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      day: 10,
      year: 2021,
      month: 2,
    });


    //devemos esperar o array esteja com dados true
    expect(appointments).toEqual(expect.arrayContaining([appointment1,appointment2]),
    );
  });
});
