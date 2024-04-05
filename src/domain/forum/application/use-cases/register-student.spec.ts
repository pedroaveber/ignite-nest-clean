import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/respositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let sut: RegisterStudentUseCase
let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

describe('Register Student Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register an user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.students[0],
    })
  })

  it('should be able to hash user password', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.students[0].password).toEqual(
      hashedPassword,
    )
  })
})
