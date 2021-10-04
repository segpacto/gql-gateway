/**
 * Implements the `headers` option passed to openapi-to-graphql package
 * described in https://github.com/IBM/openapi-to-graphql/tree/master/packages/openapi-to-graphql#options
 * @param {string} method
 * @param {string} path
 * @param {*} title
 * @param {*} resolverParams
 * @returns { authorization, origin, referer }
 */
module.exports = (method, path, title, resolverParams = {}) => {
  const { context: { req: { headers: { authorization = undefined, origin = undefined, referer = undefined } = {} } = {} } = {} } = resolverParams
  return { authorization, origin, referer }
}
