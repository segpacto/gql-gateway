const gateway = require('../src/server')

const resolvers = {
  Order: {
    pet: {
      fragment: '... on Order {petId}',
      async resolve (order, args, context, info) {
        const schema = await context.resolveSchema('pet_service')

        return info.mergeInfo.delegateToSchema({
          schema,
          operation: 'query',
          fieldName: 'getPetById',
          args: { petId: order.petId },
          context,
          info
        })
      }
    }
  }
}

const localSchema = `
  extend type Order {
    pet: Pet 
  } 
`
const config = {
  port: 5000,
  playgroundBasePath: 'gql-gateway'
}

const endpointsList = [
  { name: 'pet_service', url: 'https://petstore.swagger.io/v2/swagger.json' }
]

const ApolloServerConfig = { playground: { endpoint: config.playgroundBasePath } }

gateway({ resolvers, localSchema, endpointsList, ApolloServerConfig })
  .then(server => server.listen(config.port))
  .then(console.log(`Service is now running at port: ${config.port}`))
  .catch(err => console.log(err))
