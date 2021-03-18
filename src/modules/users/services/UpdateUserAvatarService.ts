import { injectable, inject } from 'tsyringe';

//SOLID - using dependency inversion
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';


interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { }

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('only authenticate users can change avatar.', 401);
    }

    if(user.avatar) {
      //deletar avatar anterior
      this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
