const gateway = require('gql-gateway')

const port = 5001

const endpointsList = [
  { name: 'petstore_service', url: 'https://petstore.swagger.io/v2/swagger.json' },
  { name: 'fruits_service', url: 'https://api.predic8.de/shop/swagger' }
]

// For more information about PLugins: https://www.apollographql.com/docs/apollo-server/integrations/plugins/
const apolloServerConfig = {
    plugins: [{
        async requestDidStart ({context}) {
            context.req.headers['Authorization'] = 'Bearer XXXXX'
            context.req.headers['x-access-key'] = 'ApiKey MySpecialKey'
          }
    }]
}

gateway({ endpointsList, apolloServerConfig })
  .then(server => server.listen(port))
  .then(console.log(`Service is now running at port: ${port}`))
  .catch(err => console.log(err))