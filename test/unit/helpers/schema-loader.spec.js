const schemaLoader = require('././../../../helpers/schema-loader')

require('./../../mocks/gql-gateway-requests')

describe('Schema loader', () => {
  it('load schemas and trigger onLoad function', async () => {
    const callbackOnLoad = jest.fn((swaggerSchema) => (swaggerSchema))
    const remoteRestServices = [{ name: 'petstore_service', url: 'https://petstore.swagger.io/v2/swagger.json', onLoaded: callbackOnLoad }]
    const { services, resolvedSchemas } = await schemaLoader({ remoteRestServices })

    expect(resolvedSchemas.length).toBe(1)
    expect(callbackOnLoad.mock.calls[0][1]).toBe(services[0])
  })

  it('merge local schemas', async () => {
    const remoteRestServices = [{ name: 'petstore_service', url: 'https://petstore.swagger.io/v2/swagger.json' }]
    const localSchema = `
      extend type Pet {
        ownerName: String
      }
      type ExtraProperty {
        name: String
      }
    `
    const { resolvedSchemas } = await schemaLoader({ localSchema, remoteRestServices })

    expect(resolvedSchemas.length).toBe(2)
    expect(resolvedSchemas[1]).toBe(localSchema)
  })
})
