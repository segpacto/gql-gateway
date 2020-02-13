const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
const getBodyAndHeaders = require('./get-body-headers')

/**
 * @param {object} requestOptions
 * @returns {JSON}
 */
module.exports = async ({ context: { req }, requestOptions }) => {
  const { method, body, baseUrl, path, query, bodyType } = requestOptions
  const searchPath = query ? `?${new URLSearchParams(query)}` : ''
  const url = `${baseUrl}${path}${searchPath}`

  if (!req) {
    throw new Error('Request data is not available')
  }
  // Reading the headers Out of the context since it is not passed automatically
  const { headers: { authorization } } = req
  const headers = { authorization }
  const bodyAndHeaders = getBodyAndHeaders(body, bodyType, headers)
  
  const response = await fetch(url, {
    method,
    ...bodyAndHeaders
  })

  const text = await response.text()
  if (response.ok) {
    try {
      return JSON.parse(text)
    } catch (e) {
      return text
    }
  }

  throw new Error(`Response: ${response.status} - ${text}`)
}
