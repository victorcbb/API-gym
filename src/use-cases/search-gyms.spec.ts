import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let GymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(async () => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(GymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await GymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -14.2281399,
      longitude: -42.7759954,
    })

    await GymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -14.2281399,
      longitude: -42.7759954,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await GymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -14.2281399,
        longitude: -42.7759954,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
