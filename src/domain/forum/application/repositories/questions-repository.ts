import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionWithDetails } from '../../enterprise/entities/value-objects/question-with-details'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionWithDetails | null>
  abstract findById(slug: string): Promise<Question | null>
  abstract delete(question: Question): Promise<void>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
}
