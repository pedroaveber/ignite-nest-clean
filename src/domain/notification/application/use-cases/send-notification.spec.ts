import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/respositories/in-memory-notifications-repository'

let sut: SendNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'Conteúdo da notificação',
      title: 'Nova notificação',
      recipientId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notification).toEqual(
      expect.objectContaining({
        content: 'Conteúdo da notificação',
        title: 'Nova notificação',
        recipientId: new UniqueEntityID('1'),
      }),
    )
  })
})
