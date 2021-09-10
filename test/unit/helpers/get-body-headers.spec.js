const getBodyHeaders = require('./../../../helpers/get-body-headers')
const { URLSearchParams } = require('url')

describe('get body and headers', () => {
  it('return only headers when no body occurs', () => {
    expect(getBodyHeaders(undefined, undefined, { 'x-forwarded-port': 8080 })).toStrictEqual({ headers: { 'x-forwarded-port': 8080 } })
  })

  it('should return headers and body with json Content-Type', () => {
    expect(getBodyHeaders({ test: 'my-body' }, 'json', { authorization: 'api-key some-key', 'x-forwarded-port': 8080 })).toStrictEqual(
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: 'api-key some-key',
          'x-forwarded-port': 8080
        },
        body: JSON.stringify({ test: 'my-body' })
      }
    )
  })

  it('should return headers and URLSearchParams', () => {
    expect(getBodyHeaders({ test: 'my-body' }, 'application/xml', { 'x-forwarded-host': 'http://gql-gateway-test.com' })).toStrictEqual(
      {
        headers: {
          'x-forwarded-host': 'http://gql-gateway-test.com'
        },
        body: new URLSearchParams({ test: 'my-body' })
      }
    )
  })

  it('It should proxy only headers to proxy', () => {
    expect(getBodyHeaders({ test: 'my-body' }, 'application/xml', { test: 'test', 'x-forwarded-host': 'http://gql-gateway-test.com' })).toStrictEqual(
      {
        headers: { 'x-forwarded-host': 'http://gql-gateway-test.com' },
        body: new URLSearchParams({ test: 'my-body' })
      }
    )
  })
})
