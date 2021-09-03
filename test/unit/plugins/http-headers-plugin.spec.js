const httpHeaderPlugin = require('../../../plugins/http-headers-plugin');

describe('the http header plugin', () => {
  it('should preserve x-headers from requests to apollo server in the response', async () => {

    const requestHeaders = new Map();
    requestHeaders.set('authorization', 'Bearer XXXXX');
    requestHeaders.set('x-forwarded', 'http://mops');
    requestHeaders.set('x-original-forwarded-for', '88.88.88.88');

    const context = { 
      context : { 
        setHeaders : [{ key: 'apollo-server', value: 'true' }] 
      },
      request:  {
        http : { 
          headers: requestHeaders
        } 
      },
      response : {
        http: {
          headers: new Map()
        }
      }
    }
    const result = httpHeaderPlugin.requestDidStart().willSendResponse(context)

    expect(Object.fromEntries(result.response.http.headers)).toMatchObject({
      'x-forwarded': "http://mops",
      'x-original-forwarded-for': '88.88.88.88'
    })
  })
})
