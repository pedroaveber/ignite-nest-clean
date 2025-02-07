import { z } from 'zod'

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  public async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @Param('id') answerId: string,
  ) {
    const { content, attachments } = body
    const { sub: userId } = user

    const result = await this.editAnswer.execute({
      answerId,
      attachmentIds: attachments,
      authorId: userId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
