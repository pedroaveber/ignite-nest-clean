import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  constructor(
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.answers.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answerToUpdate: Answer) {
    const answerIndex = this.answers.findIndex(
      (answer) => answer.id === answerToUpdate.id,
    )

    await this.answerAttachmentsRepository.createMany(
      answerToUpdate.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answerToUpdate.attachments.getRemovedItems(),
    )

    this.answers[answerIndex] = answerToUpdate
    DomainEvents.dispatchEventsForAggregate(this.answers[answerIndex].id)
  }

  async findById(answerId: string) {
    const answerById = this.answers.find(
      (answer) => answer.id.toString() === answerId,
    )

    if (!answerById) {
      return null
    }

    return answerById
  }

  async delete(answerToDelete: Answer) {
    const answerIndex = this.answers.findIndex(
      (answer) => answer.id === answerToDelete.id,
    )

    this.answers.splice(answerIndex, 1)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answerToDelete.id.toString(),
    )
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }
}
