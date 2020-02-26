const { createTestClient } = require('apollo-server-testing')
const gql = require('graphql-tag')
const gateway = require('./../index')
const { reservations } = require('./mocks/data/mocks')
require('./mocks/gql-gateway-requests')

describe('agreggation layer', () => {
  let Query = null

  const endpointsList = [
    { name: 'reservation_service', url: 'http://localhost/reservation-api/swagger.json' },
    { name: 'client_service', url: 'http://localhost/client-api/swagger.json' }
  ]

  const localSchema = `
    extend type Client {
      reservations : Reservations
    }
  `

  const GET_CLIENTS = gql`
    query get_clients {
      get_clients {
        clientId,
        firstName,
        middleName,
        reservations {
          data {
            reservationId,
            location
          },
          totalCount
        }
      }
    }
  `

  const resolvers = {
    Client: {
      reservations: {
        fragment: '... on Client {clientId}',
        async resolve (client, args, context, info) {
          const schema = await context.resolveSchema('reservation_service')

          return info.mergeInfo.delegateToSchema({
            schema,
            operation: 'query',
            fieldName: 'get_reservations_client_clientId',
            args: { clientId: client.clientId },
            context,
            info
          })
        }
      }
    }
  }

  beforeAll(async () => {
    const server = await gateway({ localSchema, resolvers, endpointsList })
    server.context = server.context({ req: { headers: { authorization: 'Bearer XXXXX' } } })
    const { query } = createTestClient(server)

    Query = query
  })

  it('load clients with aggregations', async () => {
    const { data } = await Query({ query: GET_CLIENTS })

    expect(data.get_clients.length).toBe(2)
    expect(data.get_clients[0].reservations.data).toEqual(reservations)
  })
})
