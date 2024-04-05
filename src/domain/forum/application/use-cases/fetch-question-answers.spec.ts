import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'

let sut: FetchQuestionAnswersUseCase
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Fetch Question Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch recent questions', async () => {
    for (let i = 1; i <= 5; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId:
            i % 2 === 0
              ? new UniqueEntityID('question-id')
              : new UniqueEntityID(),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-id',
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    expect(result.value?.answers).toHaveLength(2)
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-id'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-id',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
