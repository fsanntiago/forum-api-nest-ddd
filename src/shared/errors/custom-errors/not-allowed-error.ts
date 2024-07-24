import { UseCaseError } from '@/shared/errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message?: string) {
    const errorMessage = message ?? 'Not allowed.'
    super(errorMessage)

    this.message = errorMessage
  }
}
