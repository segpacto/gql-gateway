const { ApolloServer } = require('apollo-server')
const { mergeSchemas } = require('graphql-tools')
const schemaLoader = require('./helpers/schema-loader')

/**
 * @param {GraqhQLSchema} localSchema
 * @param resolvers
 * @param endpointsList
 * @param apolloServer
 * @param logger,
 * @param contextConfig
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
      ...contextConfig,
      req: integrationContext.req,
      resolveSchema: (schameName) => {
        const remoteSchema = services.find(service => service.name === schameName)
        return remoteSchema.schema
      }
    })
  })
}
