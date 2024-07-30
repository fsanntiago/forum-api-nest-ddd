import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityID } from '@/shared/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 6 }),
      ...override,
    },
    id,
  )
  return student
}
