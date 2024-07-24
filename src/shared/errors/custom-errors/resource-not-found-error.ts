import { UseCaseError } from '@/shared/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    const errorMessage = message ?? 'Resource not found'
    super(errorMessage)

    this.message = errorMessage
  }
}
