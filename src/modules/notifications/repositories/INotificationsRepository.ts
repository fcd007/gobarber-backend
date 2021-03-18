import ICreateNotificationDTO from "../dtos/ICreateNotificationDTO";
import Notifications from '@modules/notifications/infra/schemas/Notification';

export default interface INotificationsRepostitory {
  create(data: ICreateNotificationDTO): Promise<Notifications>;
}
