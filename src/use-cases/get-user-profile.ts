import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

import { ResourceNotFFoundError } from './errors/resource-not-found-error'

interface getUserProfileUseCaseRequest {
  userId: string
}

interface getUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: getUserProfileUseCaseRequest): Promise<getUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFFoundError()
    }

    return { user }
  }
}
