const { ApolloServer } = require('apollo-server')
const { mergeSchemas } = require('graphql-tools')
const schemaLoader = require('./helpers/schema-loader')

/**
 * @param {GraqhQLSchema} localSchema
 * @param {object} resolvers
 * @param {Array<{name: string, url: string, headers: object, onLoaded: function (swaggerJson, service) {}}>} endpointsList
 * @param {object} apolloServer
 * @param logger,
 * @param {object} contextConfig
 * @returns {ApolloServer}
 */
module.exports = async ({
  localSchema,
  resolvers,
  endpointsList,
  apolloServerConfig,
  contextConfig,
  logger
}) => {
  logger = logger || console

  if (!endpointsList) {
    throw new Error('The parameter endpointsList is required')
  }
  // Building list of Schemas by retrieving the remote JSON swagger and adding
  // the local Schema (which in theory should contain relations and resolvers to retrieve this relations)
  const { resolvedSchemas, services } = await schemaLoader({ localSchema, remoteRestServices: endpointsList })

  // Create one Schema from the list of available schemas
  const mergedSchemas = mergeSchemas({
    schemas: resolvedSchemas,
    resolvers
  })

  // Build Apollo server
  return new ApolloServer({
    ...apolloServerConfig,
    schema: mergedSchemas,
    context: (integrationContext) => ({
      ...integrationContext,
      ...contextConfig,
      req: integrationContext.req,
      connection: integrationContext.connection,
      resolveSchema: (schameName) => {
        const remoteSchema = services.find(service => service.name === schameName)
        return remoteSchema.schema
      }
    })
  })
}
