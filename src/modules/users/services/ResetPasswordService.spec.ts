import 'reflect-metadata';

// TDD - FAILURE | PASSED | REFACTORE
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '@modules/users/repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/errors/AppError';

//criando variáveis globais para criar repositórios
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUsersTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

//vamos categorizar os testes
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });
  //test to recover password
  it('Shold be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '12456789'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token,
      password: '123123123'
  });

  const updateUser = await  fakeUsersRepository.findById(user.id);
    //retorna se a função foi chamada
    expect(generateHash).toHaveBeenCalledWith('123123123');
    expect(updateUser?.password).toBe('123123123');
  });

  it('Shold not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456'
      })).rejects.toBeInstanceOf(AppError)
  });

  it('Shold not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-exxisting-user');

    await expect(
      resetPasswordService.execute({
        token,
        password: '123456'
      })).rejects.toBeInstanceOf(AppError)
  });

  it('Shold not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '12456789'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const custonDate = new Date();

      return custonDate.setHours(custonDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123123'
      })).rejects.toBeInstanceOf(AppError);
  });
});
