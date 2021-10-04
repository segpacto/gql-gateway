const nock = require('nock')

const petStore = 'https://petstore.swagger.io'
const clientApi = 'http://localhost/client-api'
const reservationApi = 'http://localhost/reservation-api'
const { clients, reservations, pets } = require('./data/mocks')

nock(petStore)
  .get('/v2/swagger.json')
  .reply(200, require('./data/swagger-petstore-api.json'))
  .persist()

nock(petStore)
  .get('/v2/pet/1')
  .reply(200, pets[0])
  .persist()

nock(petStore)
  .post('/v2/pet')
  .reply(200)
  .persist()

nock(reservationApi)
  .get('/swagger.json')
  .reply(200, require('./data/swagger-reservations-api.json'))
  .persist()

nock(reservationApi)
  .get('/reservations/client/1')
  .reply(200, {
    data: reservations,
    totalCount: 1
  })
  .persist()

nock(reservationApi)
  .get('/reservations/client/2')
  .reply(200, {
    data: [],
    totalCount: 0
  })
  .persist()

nock(clientApi)
  .get('/swagger.json')
  .reply(200, require('./data/swagger-client-api.json'))
  .persist()

nock(clientApi)
  .get('/clients')
  .reply(200, clients)
  .persist()

nock(clientApi)
  .get('/client?=whatever')
  .reply(200, { data: { test: 'test' } })
  .persist()

nock(clientApi)
  .get('/client?=with-error')
  .replyWithError('Whatever error')
  .persist()
