import { UseCaseError } from '@/shared/errors/use-case-error'

export class StudentAlreadyError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student ${identifier} already exists.`)
  }
}
