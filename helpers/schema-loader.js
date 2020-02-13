const { createSchema } = require('swagger-to-graphql')
const callBackend = require('./callbackend')
const request = require('request-promise')
const url = require('url')

/**
 * @param {GraqhQLSchema} localSchema
 * @param {object} remoteRestServices
 * @returns {Array<{name: string, prefix: string, url: string, schema: GraphQLSchema}>}
 */
module.exports = async ({ localSchema, remoteRestServices }) => {
  const schemasAvailable = remoteRestServices.map(async service => {
    const swaggerResponse = await request({
      uri: service.url,
      headers: service.headers
    })
    const swaggerSchema = JSON.parse(swaggerResponse)
    const swaggerUrl = new url.URL(service.url)
    
    if (!swaggerSchema.host) {
      swaggerSchema.host = swaggerUrl.host
    }

    if (!swaggerSchema.schemes) {
      swaggerSchema.schemes = [swaggerUrl.protocol.replace(':', '')]
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
