import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AutheticateUserService from './AutheticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let autheticateUser: AutheticateUserService;
let createUser: CreateUserService;

//vamos categorizar os testes
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    autheticateUser = new AutheticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  //test to create new user
  it('Shold be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Claudeilton Dantas',
      email: 'fcd007@hotmail.com',
      password: '123456789',
    });

    const response = await autheticateUser.execute({
      email: 'fcd007@hotmail.com',
      password: '123456789',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  //authenticate user not existing
  it('Shold not be able to authenticate with non existing  user', async () => {
    await expect(
      autheticateUser.execute({
        email: 'fcd007@hotmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Shold not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Claudeilton Dantas',
      email: 'fcd007@hotmail.com',
      password: '123456789',
    });

    await expect(
      autheticateUser.execute({
        email: 'fcd007@hotmail.com',
        password: 'password-error:6789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
