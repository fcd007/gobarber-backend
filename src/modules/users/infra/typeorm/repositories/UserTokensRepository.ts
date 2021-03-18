import { getRepository, Repository } from 'typeorm';

import UserToken  from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUsersTokensRepository'

class UserTokensRepository implements IUserTokensRepository {
  //criando uma variável para Repository User
  private ormRepository: Repository<UserToken>;
  constructor() {
    this.ormRepository = getRepository(UserToken)
  }

  //implementando o método para busca de usuários por ID
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create(
      {
        user_id,
      });

      await this.ormRepository.save(userToken);

      return userToken;
  }
}

export default UserTokensRepository;
