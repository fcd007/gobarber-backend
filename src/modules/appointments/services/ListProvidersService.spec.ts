import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
//vamos categorizar os testes
describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  //test to create new user - update avatar
  it('Shold be able to list the providers.', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe2',
      email: 'johndoe2@email.com',
      password: '123456789',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Doe3',
      email: 'johndoe3@email.com',
      password: '123456789',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Doe4',
      email: 'johndoe4@email.com',
      password: '123456789',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });

    expect(providers).toEqual([user1,user2 ]);
  });
});
