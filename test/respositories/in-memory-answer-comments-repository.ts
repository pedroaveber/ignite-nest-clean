import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  constructor(
    private readonly inMemoryStudentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answerComment: AnswerComment) {
    this.answerComments.push(answerComment)
  }

  async findById(id: string) {
    const answerCommentById = this.answerComments.find(
      (answerComment) => answerComment.id.toString() === id,
    )

    if (!answerCommentById) {
      return null
    }

    return answerCommentById
  }

  async delete(answerCommentToDelete: AnswerComment) {
    const answerCommentIndex = this.answerComments.findIndex(
      (answerCommen) => answerCommen.id === answerCommentToDelete.id,
    )

    this.answerComments.splice(answerCommentIndex, 1)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const commentsByAnswerId = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return commentsByAnswerId
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const commentsByAnswerId = this.answerComments
      .filter(
        (questionComment) => questionComment.answerId.toString() === answerId,
      )
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.inMemoryStudentsRepository.students.find(
          (student) => {
            return student.id.equals(comment.authorId)
          },
        )

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" not found.`,
          )
        }

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return commentsByAnswerId
  }
}
