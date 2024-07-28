import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/shared/entities/unique-entity-id'
import { Question as PrismaQuestion, Prisma } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion): Question {
    return Question.create(
      {
        title: prismaQuestion.title,
        content: prismaQuestion.content,
        authorId: new UniqueEntityID(prismaQuestion.authorId),
        bestAnswerId: prismaQuestion.bestAnswerId
          ? new UniqueEntityID(prismaQuestion.bestAnswerId)
          : null,
        slug: Slug.create(prismaQuestion.slug),
        updateAt: prismaQuestion.updatedAt,
        createdAt: prismaQuestion.createdAt,
      },
      new UniqueEntityID(prismaQuestion.id),
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updateAt,
    }
  }
}
