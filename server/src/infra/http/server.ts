import { fastifyCors } from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { env } from '../../env'
import { transformSwaggerSchema } from '../utils/transform-swagger-schema'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'
import { getLinkByShortenedRoute } from './routes/get-link-by-shortened'
import { getLinksRoute } from './routes/get-links'
import { incrementAccessRoute } from './routes/increment-access'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if(hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  console.error(error)

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

server.register(fastifyCors, { 
  origin: env.NODE_ENV === 'production' 
    ? false // Em produção, configure as origens permitidas
    : ['http://localhost:5173', 'http://localhost:3000'] // Em desenvolvimento, permite o frontend
})

server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      description: 'API for URL shortening service',
      version: '1.0.0',
    },
  },
    transform: transformSwaggerSchema
})

server.register(createLinkRoute)
server.register(getLinksRoute)
server.register(getLinkByShortenedRoute)
server.register(deleteLinkRoute)
server.register(incrementAccessRoute)
server.register(exportLinksRoute)

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP Server running on port ${env.PORT}!`)
})