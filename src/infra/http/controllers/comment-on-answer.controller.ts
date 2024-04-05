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

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const createAnswerBodySchema = z.object({
  content: z.string(),
})

type CreateAnswerBodySchema = z.infer<typeof createAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  public async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createAnswerBodySchema))
    body: CreateAnswerBodySchema,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.commentOnAnswer.execute({
      authorId: userId,
      content,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
