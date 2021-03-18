import { getMongoRepository, MongoRepository } from 'typeorm';

//fazendo a importação da interface appointamentsRepositoty
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  //criando uma variável para Repository
  private ormRepository: MongoRepository<Notification>;
  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO ): Promise<Notification>{
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });
    //realizando a operação de save() do typeorm
    await this.ormRepository.save(notification);
    //retornando o repositório creado
    return notification;
  }
}

export default NotificationsRepository;
