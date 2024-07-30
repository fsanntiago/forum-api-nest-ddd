import { Student } from '../../enterprise/entities/student'
import { Either, left, right } from '@/shared/either'
import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentAlreadyExists =
      await this.studentsRepository.findByEmail(email)

    if (studentAlreadyExists) {
      return left(new StudentAlreadyError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: passwordHash,
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
