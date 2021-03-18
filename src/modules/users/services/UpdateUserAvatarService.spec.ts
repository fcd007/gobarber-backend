import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeStorageAvatar from '@shared/container/providers/StorageProvider/fakes/FakeProviderAvatar';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider:FakeStorageAvatar;
let updateUserAvatar: UpdateUserAvatarService;
//vamos categorizar os testes
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageAvatar();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  //test to create new user - update avatar
  it('Shold be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  //test to create new user
  it('Shold not be able to update avatar from non existing user', async () => {
  await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.jpg',
      })).rejects.toBeInstanceOf(AppError);
  });

  //test to create new user - update avatar
  it('Shold delete old avatar when updating new one', async () => {
    //retorna se a função foi chamada
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456789',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });
    //spy - jest function observer
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');
  });
});
