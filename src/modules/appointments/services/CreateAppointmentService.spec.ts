import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppoitmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppoimentRepository: CreateAppoitmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

//vamos categorizar os testes
describe('CreateAppoitment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppoimentRepository = new CreateAppoitmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository
    );
  });

  //test to create new appointment
  it('Shold be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 4, 9).getTime();
    });

    const appointment = await createAppoimentRepository.execute({
      date: new Date(2021, 0, 4, 11),
      user_id: '7e3cc2d0-8701-4556-926e-611a66fd1caf',
      provider_id: '123456789',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456789');
  });

  // test not create new tow appointment same time
  it('Shold not be able to create two appoitments on the same time', async () => {
    const dateAppointment = new Date(2020, 12, 10, 12);

    await createAppoimentRepository.execute({
      provider_id: '123456789',
      user_id: '7e3cc2d0-8701-4556-926s-611a0ffd1caf',
      date: dateAppointment,
    });

    await expect(createAppoimentRepository.execute({
      provider_id: '123456789',
      user_id: '7e3cc2d0-8701-4556-926s-611a0ffd1caf',
      date: dateAppointment,
    })).rejects.toBeInstanceOf(AppError);
  });

  // not create two appoitments on the same time
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 4, 17).getTime();
    });

    await expect(createAppoimentRepository.execute({
      provider_id: '123456789',
      user_id: '7e3cc2d0-8701-4556-926s-611a0ffd1caf',
      date: new Date(2021, 0, 4, 10),
    })).rejects.toBeInstanceOf(AppError)
  });

  //not create an appointment with same user as provider
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 4, 18).getTime();
    });

    await expect(createAppoimentRepository.execute({
      provider_id: '123456789',
      user_id: '123456789',
      date: new Date(2021, 0, 4, 19),
    })).rejects.toBeInstanceOf(AppError)
  });

  //not create an appointment with same user as provider
  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 4, 18).getTime();
    });

    await expect(createAppoimentRepository.execute({
      provider_id: '123456789',
      user_id: '123123123',
      date: new Date(2021, 0, 5, 7),
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppoimentRepository.execute({
      provider_id: '123456789',
      user_id: '123123123',
      date: new Date(2021, 0, 5, 18),
    })).rejects.toBeInstanceOf(AppError);
  });
});
