import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  answerAttachments: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.answerAttachments.filter(
      (answerAttachment) => {
        return answerAttachment.answerId.toString() === answerId
      },
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.answerAttachments.filter(
      (answerAttachment) => {
        return answerAttachment.answerId.toString() !== answerId
      },
    )

    this.answerAttachments = answerAttachments
  }

  async createMany(attachments: AnswerAttachment[]) {
    this.answerAttachments.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    const answerAttachments = this.answerAttachments.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.answerAttachments = answerAttachments
  }
}
