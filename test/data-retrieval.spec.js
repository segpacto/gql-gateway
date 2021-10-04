require('./mocks/gql-gateway-requests')

const gateway = require('../index')
const gql = require('graphql-tag')

describe('Operations', () => {
  describe('Swagger v2', () => {
    const buildPetStoreGateway = () => {
      const endpointsList = [{ name: 'petstore_service', url: 'https://petstore.swagger.io/v2/swagger.json' }]
      return gateway({ endpointsList })
    }
    it('Query pet', async () => {
      const server = await buildPetStoreGateway()
      const GET_PET = gql`
                query getPet($petId: BigInt!) {
                    pet(petId: $petId) {
                        name
                    }
                }
            `

      const { data } = await server.executeOperation({
        query: GET_PET,
        variables: { petId: 1 }
      })

      expect(data).toEqual({
        pet: {
          name: 'pet001'
        }
      })
    })

    it('Mutate Pet', async () => {
      const server = await buildPetStoreGateway()
      const ADD_PET = gql`
                  mutation addPet($petInput: PetInput!) {
                      addPet(petInput: $petInput)
                  }
              `

      const { data } = await server.executeOperation({
        query: ADD_PET,
        variables: {
          petInput: {
            id: 1,
            name: 'pet002',
            photoUrls: ['url1', 'url2']
          }
        }
      })

      expect(data).toEqual({
        addPet: null
      })
    })
  })
})
