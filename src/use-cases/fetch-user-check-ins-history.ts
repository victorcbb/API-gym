import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCHeckInHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCHeckInHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCHeckInHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCHeckInHistoryUseCaseRequest): Promise<FetchUserCHeckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
