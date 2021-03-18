import { injectable, inject } from 'tsyringe';

//SOLID - using dependency inversion
import AppError from '@shared/errors/AppError';
import IHashProvider  from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfile {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hasProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if(!user) {
      throw new AppError('user not found.');
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email);
    //verificação de validação
    if(userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError('email already in use.');
    }

    user.name = name;
    user.email = email;

    if(password && !old_password) {
      throw new AppError('You need to inform the old password to set a new password.');
    }

    if(password && old_password) {
      const checkOldPassword = await this.hasProvider.compareHash(
        old_password,
        user.password
      )

      if(!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await this.hasProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfile;
