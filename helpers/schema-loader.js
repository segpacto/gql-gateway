const { createSchema } = require('swagger-to-graphql')
const callBackend = require('./callbackend')
const fetch = require('node-fetch')

/**
 * @param {GraqhQLSchema} localSchema
 * @param {object} remoteRestServices
 * @returns {Array<{name: string, url: string, schema: GraphQLSchema}>}
 */
module.exports = async ({ localSchema, remoteRestServices }) => {
  const schemasAvailable = remoteRestServices.map(async service => {
    const swaggerResponse = await fetch(service.url, {
      headers: {
        'Content-Type': 'application/json',
        ...service.headers
      }
    })

    let swaggerSchema = await swaggerResponse.json()

    if (service.onLoaded) {
      swaggerSchema = service.onLoaded(swaggerSchema, service)
    }

    // Keep an schema copy per service
    service.schema = createSchema({ swaggerSchema, callBackend })

    return service.schema
  })

  const remoteSchemas = await Promise.all(schemasAvailable)

  if (localSchema) {
    remoteSchemas.push(localSchema)
  }

  return {
    services: remoteRestServices,
    resolvedSchemas: remoteSchemas
  }
}
