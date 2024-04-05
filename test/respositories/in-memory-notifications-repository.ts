import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = []

  async create(notification: Notification) {
    this.notifications.push(notification)
  }

  async findById(notificationId: string) {
    const notificationById = this.notifications.find(
      (notification) => notification.id.toString() === notificationId,
    )

    if (!notificationById) {
      return null
    }

    return notificationById
  }

  async save(notificationToUpdate: Notification) {
    const notificationIndex = this.notifications.findIndex(
      (notification) => notification.id === notificationToUpdate.id,
    )

    this.notifications[notificationIndex] = notificationToUpdate
  }
}
