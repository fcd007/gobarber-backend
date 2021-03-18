import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
//vamos categorizar os testes
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  //test to create new user - update avatar
  it('Shold be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe2',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    const profile = await showProfile.execute({
      user_id: user.id
    });

    expect(profile.name).toBe('John Doe2');
    expect(profile.email).toBe('johndoe@email.com');
  });

   //test to create new user - update avatar
   it('Shold not be able to show the profile from non-existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'not-user_id'
      })).rejects.toBeInstanceOf(AppError);
  });
});
