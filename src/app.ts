import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  if (env.NDOE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Aqui deveria ser feito um log em uma ferramenta externa como Datadog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server errror.' })
})
