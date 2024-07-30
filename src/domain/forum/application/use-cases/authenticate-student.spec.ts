import { AuthenticateStudentUseCase } from './authenticate-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/faker-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: AuthenticateStudentUseCase
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('Authenticate Student', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate a student with wrong credentials', async () => {
    const result = await sut.execute({
      email: 'johndoe1@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
