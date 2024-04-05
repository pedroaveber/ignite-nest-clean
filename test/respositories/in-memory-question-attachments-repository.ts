import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  questionAttachments: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.toString() === questionId
      },
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.toString() !== questionId
      },
    )

    this.questionAttachments = questionAttachments
  }

  async createMany(attachments: QuestionAttachment[]) {
    this.questionAttachments.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    const questionAttachments = this.questionAttachments.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.questionAttachments = questionAttachments
  }
}
