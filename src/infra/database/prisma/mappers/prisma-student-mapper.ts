import { Student } from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityID } from '@/shared/entities/unique-entity-id'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaStudentMapper {
  static toDomain(prismaUser: PrismaUser): Student {
    return Student.create(
      {
        email: prismaUser.email,
        password: prismaUser.password,
        name: prismaUser.name,
      },
      new UniqueEntityID(prismaUser.id),
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      password: student.password,
      name: student.name,
    }
  }
}
