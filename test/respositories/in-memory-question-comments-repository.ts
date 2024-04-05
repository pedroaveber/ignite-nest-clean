import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(
    private readonly inMemoryStudentsRepository: InMemoryStudentsRepository,
  ) {}

  public questionComments: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment)
  }

  async findById(id: string) {
    const questionCommentById = this.questionComments.find(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (!questionCommentById) {
      return null
    }

    return questionCommentById
  }

  async delete(questionCommentToDelete: QuestionComment) {
    const questionCommentIndex = this.questionComments.findIndex(
      (questionCommen) => questionCommen.id === questionCommentToDelete.id,
    )

    this.questionComments.splice(questionCommentIndex, 1)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const commentsByQuestionId = this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .slice((page - 1) * 20, page * 20)

    return commentsByQuestionId
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const commentsByQuestionId = this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
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

    return commentsByQuestionId
  }
}
