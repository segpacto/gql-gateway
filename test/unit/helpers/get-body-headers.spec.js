const getBodyHeaders = require('./../../../helpers/get-body-headers')
const { URLSearchParams } = require('url')

describe('get body and headers', () => {
  it('return headers only when no body occurs', () => {
    expect(getBodyHeaders(undefined, undefined, { test: 'test' })).toStrictEqual({ headers: { test: 'test' } })
    expect(getBodyHeaders({ test: 'my-body' }, 'json', { test: 'test' })).toStrictEqual(
      {
        headers: {
          'Content-Type': 'application/json',
          test: 'test'
        },
        body: JSON.stringify({ test: 'my-body' })
      }
    )
  })
  expect(getBodyHeaders({ test: 'my-body' }, 'application/xml', { test: 'test' })).toStrictEqual(
    {
      headers: { test: 'test' },
      body: new URLSearchParams({ test: 'my-body' })
    }
  )
})
