import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let GymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(GymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await GymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -14.2281399,
      longitude: -42.7759954,
    })

    await GymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -14.0626713,
      longitude: -42.4876324,
    })

    const { gyms } = await sut.execute({
      userLatitude: -14.2281399,
      userLongitude: -42.7759954,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
