import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionWithDetails } from '@/domain/forum/enterprise/entities/value-objects/question-with-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionWithDetails {
    return QuestionWithDetails.create({
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: raw.author.name,
      questionId: new UniqueEntityID(raw.id),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      slug: Slug.create(raw.slug),
      title: raw.title,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
    })
  }
}
