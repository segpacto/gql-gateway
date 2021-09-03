const callbackend = require('./../../../helpers/callbackend')
require('./../../mocks/gql-gateway-requests')
const nock = require('nock')

describe('callbackend', () => {
  it('throw error when no req is attached to context', async () => {
    const context = { test: 'test' }
    const requestOptions = { baseUrl: 'http://localhost', path: 'my-path', query: '?=whatever', bodyType: 'json' }
    try {
      await callbackend({ context, requestOptions })
    } catch (err) {
      expect(err.message).toBe('Request data is not available')
    }
  })

  it('build and make request', async () => {
    const context = { req: { headers: { authorization: 'Bearer XXXXX' } } }
    const requestOptions = { baseUrl: 'http://localhost', path: '/client-api/client', query: '?=whatever', bodyType: 'json' }
    expect(await callbackend({ context, requestOptions })).toStrictEqual({ data: { test: 'test' } })
  })

  it('create request get error response', async () => {
    const context = { req: { headers: { authorization: 'Bearer XXXXX' } } }
    const requestOptions = { baseUrl: 'http://localhost', path: '/client-api/client', query: '?=with-error', bodyType: 'json' }
    try {
      await callbackend({ context, requestOptions })
    } catch (err) {
      expect(err.message).toBe('request to http://localhost/client-api/client?=with-error failed, reason: Whatever error')
    }
  })

  it('x-headers on backend requests should be preserved', async () => {
    const context = { req: { headers: { authorization: 'Bearer XXXXX', 'x-forwarded': 'http://mops', 'x-original-forwarded-for': '88.88.88.88' } } }
    const requestOptions = { baseUrl: 'http://localhost', path: '/headers' }
    const scope = nock('http://localhost')
      .get('/headers')
      .reply(200)
      .persist()

      scope.on('request', function(req, interceptor, body) {
      expect(req.headers).toMatchObject({
        'x-forwarded': ["http://mops"],
        'x-original-forwarded-for': ['88.88.88.88']
      })
    });
    await callbackend({ context, requestOptions });
  })
})
