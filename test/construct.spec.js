require('./mocks/gql-gateway-requests')

const gateway = require('../index')
const apolloServer = require('apollo-server')

describe('Server construct', () => {
  it('error on empty swagger endpoints list', async () => {
    try {
      await gateway({})
    } catch (err) {
      expect(err.message).toBe('The parameter endpointsList is required')
    }
  })

  it('error loading endpoints', async () => {
    try {
      const endpointsList = [{ name: 'petstore_service', url: 'https://no-existent-endpoint/swagger.json' }]
      await gateway({ endpointsList })
    } catch (err) {
      expect(err.code).toBe('ENOTFOUND')
      expect(err.message).toBe('request to https://no-existent-endpoint/swagger.json failed, reason: getaddrinfo ENOTFOUND no-existent-endpoint')
    }
  })

  it('load of PetStore schema', async () => {
    const endpointsList = [{ name: 'petstore_service', url: 'https://petstore.swagger.io/v2/swagger.json' }]
    const server = await gateway({ endpointsList })

    expect(server instanceof apolloServer.ApolloServer)
  })
})
