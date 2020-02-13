const { URLSearchParams } = require('url')

module.exports = (body, bodyType, headers) => {
  if (!body) {
    return { headers }
  }

  if (bodyType === 'json') {
    return {
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    }
  }

  return {
    headers,
    body: new URLSearchParams(body)
  }
}
