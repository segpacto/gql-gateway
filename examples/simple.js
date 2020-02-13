const gateway = require('../src/server')

const config = {
  port: 5000,
  playgroundBasePath: 'advanced-gql-gateway'
}

const endpointsList = [
  { name: 'petstore_service', url: 'https://petstore.swagger.io/v2/swagger.json' },
  { name: 'fruits_service', url: 'https://api.predic8.de/shop/swagger' }
]

gateway({ endpointsList })
  .then(server => server.listen(config.port))
  .then(console.log(`Service is now running at port: ${config.port}`))
  .catch(err => console.log(err))
