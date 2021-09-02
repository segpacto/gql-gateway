module.exports =
{
  requestDidStart: () => {
    return {
      willSendResponse (requestContext) {
        const { setHeaders = [] } = requestContext.context

        if (!Array.isArray(requestContext.context.setHeaders)) {
          console.warn('headers must be an array of objects in format [{key: headerTitle, value: headerValue}]')
        }
        setHeaders.forEach(({ key, value }) => {
          requestContext.response.http.headers.append(key, value)
        })

        requestContext.request.http.headers.forEach((value, key) => {
          if (key.indexOf('x-forwarded') !== -1 || key.indexOf('x-original') !== -1) {
            requestContext.response.http.headers.append(key, value)
          }
        })

        return requestContext
      }
    }
  }
}
