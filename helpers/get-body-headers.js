const { URLSearchParams } = require('url')
const HEADERS_TO_PROXY = ['authorization', 'x-forwarded', 'x-original']


module.exports = (body, bodyType, headers) => {
  // Reading the headers Out of the context since it is not passed automatically
  const headersToProxy = {}
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      for (header of HEADERS_TO_PROXY) {
        if (key.indexOf(header) !== -1) {
          headersToProxy[key] = value
        }
      }
    })
  }

  if (!body) {
    return { headers: headersToProxy }
  }

  if (bodyType === 'json') {
    return {
      headers: {
        'Content-Type': 'application/json',
        ...headersToProxy
      },
      body: JSON.stringify(body)
    }
  }

  return {
    headers: headersToProxy,
    body: new URLSearchParams(body)
  }
}
