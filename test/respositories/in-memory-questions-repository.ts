import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { QuestionWithDetails } from '@/domain/forum/enterprise/entities/value-objects/question-with-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private readonly inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private readonly inMemoryAttachmentsRepository: InMemoryAttachmentsRepository,
    private readonly inMemoryStudentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.questions.push(question)

    await this.inMemoryQuestionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(questionToUpdate: Question) {
    const questionIndex = this.questions.findIndex(
      (question) => question.id === questionToUpdate.id,
    )

    await this.inMemoryQuestionAttachmentsRepository.createMany(
      questionToUpdate.attachments.getNewItems(),
    )

    await this.inMemoryQuestionAttachmentsRepository.deleteMany(
      questionToUpdate.attachments.getRemovedItems(),
    )

    this.questions[questionIndex] = questionToUpdate
    DomainEvents.dispatchEventsForAggregate(this.questions[questionIndex].id)
  }

  async findBySlug(slug: string) {
    const questionBySlug = this.questions.find(
      (question) => (question.slug.value = slug),
    )

    if (!questionBySlug) {
      return null
    }

    return questionBySlug
  }

  async findById(questionId: string) {
    const questionById = this.questions.find(
      (question) => question.id.toString() === questionId,
    )

    if (!questionById) {
      return null
    }

    return questionById
  }

  async delete(questionToDelete: Question) {
    const questionIndex = this.questions.findIndex(
      (question) => question.id === questionToDelete.id,
    )

    this.questions.splice(questionIndex, 1)

    await this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(
      questionToDelete.id.toString(),
    )
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async findDetailsBySlug(slug: string) {
    const question = this.questions.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.inMemoryStudentsRepository.students.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`,
      )
    }

    const questionAttachments =
      this.inMemoryQuestionAttachmentsRepository.questionAttachments.filter(
        (questionAttachment) => {
          return questionAttachment.questionId.equals(question.id)
        },
      )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.inMemoryAttachmentsRepository.attachments.find(
        (attachment) => {
          return attachment.id.equals(questionAttachment.attachmentId)
        },
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return QuestionWithDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }
}
