## Apollo GraphQL Gateway 

### Description 
This repository is a GraphQL Gateway that allows the interaction with Swagger based REST APIs.
Through this gateway, it is possible to easily establish aggregations between the REST services using GraphQL generated queries and types, and serve all as part of one response.  

### Knowledge Base
- [Swagger](https://swagger.io/docs/)
- [GraphQl Schema Stitching](https://www.apollographql.com/docs/apollo-server/features/schema-stitching/)
- [GraphQl Schema Delegation](https://www.apollographql.com/docs/apollo-server/features/schema-delegation/)


### How this GraphQl-Gateway works
1. Read all swagger endpoints passed that are services REST available.
2. Retrieve from each one of the services published their Swagger Json, build GraphQl Types, Queries and Mutations, as well as auto-generate the resolvers.
3. Merge our local GraphQl definitions with the agreggations and extensions along with the previous generated ones.
4. Publish the GraphQl server with all agreggations. 

### Techical Explanation
Below, we describe how to interact between services using agreggations(relations). In this case we use the `Customer` and `Rental` services.

1. `Customer` service
```
...
paths:
    "/customers":
        get:
            description: "Return an Array of existing customers"
            responses:
                '200':
                    description: "successful operation"
                    schema:
                        type: array
                        items:  
                            "$ref": "#/definitions/Customer"
...
definitions :
    Customer:
        type: object
        properties:
            customerId:
                type: string
            firstname:
                type: string
            lastname:
                type: string
...
```

2. `Rental` service
```
...
paths:
  paths:
    '/rentals/{customerId}':
      get:
        tags:
          - Rental
        parameters:
          - name: customerId
            in: path
            description: ID of the customer to fetch last rentals
            required: true
            type: string
        summary: Return a summary of the last rentals
        description: Return a sumary of the customer rentals
        responses:
          '200':
            description: successful operation
            schema:
                type: array
                items:  
                    "$ref": "#/definitions/Rental"
...
definitions :
    Rental:
        type: object
        properties:
            rentalId:
                type: string
            customerId:
                type: string
            distanceUnit:
                type: string
            startLatitude:
                type: integer
            startLongitude:
                type: integer
...
```
Now, we need to extend the GraphQL definitions to introduce our customer aggregations:

- Extend `GraphQl` Types definitions:
```graph
    extend type Customer {
        rentals: Rentals
    }

    # You can always declare the relation in one direction
    extend type Rentals {
        customer: Customer
    }
```
> This will automatically indicate to the GraphQl server that the Type `Customer` will have another field named rentals which means, the `Rentals` relations.  

- Extend `GraphQl` Queries definitions:
```graph
type Queries {
    get_rentals_customerId(customerId: String!): Rentals!
    get_customers(): [Customer]!
}

```

- Finally, extend `GraphQl` resolvers:
```js
Customer: {
    rentals: {
      fragment: '... on Customer {customerId}',
      async resolve (customer, args, context, info) {
        return info.mergeInfo.delegateToSchema({
          schema: customerSchema,
          operation: 'query',
          fieldName: 'get_rentals_customerId',
          args: {
            referenceUuid: customer.customerId
          },
          context,
          info
        })
      }
    }
  },
```

- Get vehicles + remarks (Ex aggregation)

```graph
query {
  get_vehicles {
    data {
      numberPlate,
      vin,
      remarks {
        data {
          remark
        },
        totalCount
      }
    }
  }
}
```
 
- Get customer + remarks (Ex aggregation)

```graph
mutation {
  post_customers_search(body:{}) {
    data {
      firstName,
      lastName,
      remarks {
        data {
          remark
        }
      }
  	}
  }
}
````