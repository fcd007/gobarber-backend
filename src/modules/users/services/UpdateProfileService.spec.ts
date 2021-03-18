import 'reflect-metadata';

import FakeHashProvider  from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider:FakeHashProvider;
let updateProfile: UpdateProfileService;
//vamos categorizar os testes
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  //test to create new user - update avatar
  it('Shold be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'john Duo2',
      email: 'johnduo2@gmail.com',
    });

    expect(updateUser.name).toBe('john Duo2');
    expect(updateUser.email).toBe('johnduo2@gmail.com');
  });

  it('Shold be able to profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'no-email@gmail.com'
      })).rejects.toBeInstanceOf(AppError);
  });

  it('Shold not be able to change to another user email', async () => {
   await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456789',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'john Duo2',
        email: 'johndoe@email.com',
      })).rejects.toBeInstanceOf(AppError);
  });

  it('Shold be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'john Duo2',
      email: 'johnduo2@gmail.com',
      old_password: '123456789',
      password: '123123123'
    });

    expect(updateUser.password).toBe('123123123');
   });

  it('Shold not be able to update the password with old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'john Duo2',
        email: 'johnduo2@gmail.com',
        password: '123123123'
      })).rejects.toBeInstanceOf(AppError);
   });


  it('Shold not be able to update the password with wrong old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'john Duo2',
        email: 'johnduo2@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123123'
      })).rejects.toBeInstanceOf(AppError);
   });

  //test to create new user - update avatar
  it('Shold not be able to update profile from non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: '12451555555555',
        name: 'non-existing-user',
        email: 'non-existing-user@email.com',
      })).rejects.toBeInstanceOf(AppError);
    });
});
