import { injectable, inject } from 'tsyringe';

//SOLID - using dependency inversion
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest{
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private IHashProvider: IHashProvider,
  ) { }

  public async execute({ name , email, password }: IRequest): Promise<User>{
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.IHashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
 }
}

export default CreateUserService;
