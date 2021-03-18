import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

//vamos categorizar os testes
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);
  });

  //test to create new user
  it('Shold be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Claudeilton Dantas',
      email: 'fcd007@hotmail.com',
      password: '12456789'
    });

    expect(user).toHaveProperty('id');
  });

  //test to e-mail user
  it('Shold not be able to create a new user with same e-mail another', async () => {
    await createUser.execute({
      name: 'Claudeilton Dantas',
      email: 'fcd007@hotmail.com',
      password: '12456789'
    });

    await expect(
        createUser.execute({
        name: 'Claudeilton Dantas',
        email: 'fcd007@hotmail.com',
        password: '123123123'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
