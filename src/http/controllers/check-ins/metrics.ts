import { FastifyRequest, FastifyReply } from 'fastify'

import { makeGetUseMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const metricsUseCase = makeGetUseMetricsUseCase()

  const { checkInsCount } = await metricsUseCase.execute({
    userId: req.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
