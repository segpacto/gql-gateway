const { createGraphQLSchema } = require('openapi-to-graphql')

const buildHeaders = require('./build-headers')
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

    /**
     * A `report` value is part of createGraphQLSchema function returned value
     * TODO: include into DEBUG mode for future versions
     */
    const { schema } = await createGraphQLSchema(swaggerSchema, {
      fillEmptyResponses: true,
      headers: buildHeaders
    })

    service.schema = schema

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
