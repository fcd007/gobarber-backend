//métodos para users: findById - findByEmail - create - save
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindProvidersDTO from '../dtos/IFindProvidersDTO';

//criando os métodos da nossa interface
export default interface IUsersRepository {
  findAllProviders(data: IFindProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
