import { v4 as uuidv4 } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';
//fazendo a importação da interface IUserRepository
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUsersTDO from '@modules/users/dtos/ICreateUserDTO'
import IFindProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';


class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];
  //implementando o método para busca de usuários por ID
  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  //implementando o método para busca de usuário por email
  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
     return findUser;
  }

  public async findAllProviders({
    except_user_id
  }: IFindProvidersDTO): Promise<User[]> {
    //usando desestruturação
    let { users } = this;
    //removendo com filter o usuário encontrado
    if(except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  //definindo e implementando o método create com base na interface
  public async create({
    name,
    email,
    password
  }: ICreateUsersTDO): Promise<User> {
    const user = new User();
    //atribuindo valores ao user
    user.id = uuidv4();
    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);

    return user;
  }

  //implementando o método para atualizar nosso usuário
  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
