import { z } from 'zod'

import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller('/questions')
export class FetchRecentQuestionController {
  constructor(
    private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questions } = result.value

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
    }
  }
}
