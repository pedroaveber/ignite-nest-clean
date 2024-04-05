import { z } from 'zod'

import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const createQuestionBodySchema = z.object({
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  public async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.commentOnQuestion.execute({
      authorId: userId,
      content,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
