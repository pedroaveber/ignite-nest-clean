import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export interface QuestionWithDetailsProps {
  questionId: UniqueEntityID
  content: string
  authorId: UniqueEntityID
  author: string
  title: string
  slug: Slug
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionWithDetails extends ValueObject<QuestionWithDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionWithDetailsProps) {
    return new QuestionWithDetails(props)
  }
}
