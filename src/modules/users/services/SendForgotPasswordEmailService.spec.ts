import 'reflect-metadata';

// TDD - RED => FAILURE | GREEN => PASSED | REFATORE
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUsersTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';

//criando variáveis globais para criar repositórios
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

//vamos categorizar os testes
describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });
  //test to recover password
  it('Shold be able to recover the password using e-mail', async () => {

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '12456789'
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@mail.com',
  });

    //retorna se a função foi chamada
    expect(sendMail).toHaveBeenCalled();
  });

  it('Shold be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@mail.com',
    })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Shold generate a forgot password token', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '12456789'
    });

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@mail.com',
  });

    //retorna se a função foi chamada
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
