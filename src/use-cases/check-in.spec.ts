import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '999999999',
      latitude: -14.2281399,
      longitude: -42.7759954,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to Check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -14.2281399,
      userLongitude: -42.7759954,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to Check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -14.2281399,
      userLongitude: -42.7759954,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -14.2281399,
        userLongitude: -42.7759954,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInError)
  })

  it('should be able to Check in twice but in diferent days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -14.2281399,
      userLongitude: -42.7759954,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -14.2281399,
      userLongitude: -42.7759954,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to Check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '999999999',
      latitude: new Decimal(-14.2035224),
      longitude: new Decimal(-42.7863051),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -14.2281399,
        userLongitude: -42.7759954,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
