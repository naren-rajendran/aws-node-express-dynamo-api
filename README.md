# Serverless Node Express API on AWS

A simple `user` CRUD api built using [serverless framework](https://github.com/serverless/serverless) and node.js to be deployed on AWS.

## API endpoints

#### Create User

<details>
  <summary><code>POST</code> <code><b>/users</b></code></summary>

##### Parameters

> | name     |  type     | data type     | description   |
> |----------|-----------|---------------|---------------|
> | None     |  required | object/json   | request.body  |

##### Request.body

> ```javascript
>  {
>       "userId": (will be part of the response),
>       "firstName": <required>,
>       "lastName": <required>,
>       "email": <required>,
>       "dateOfBirth": [optional],
>       "phone": [optional],
>       "address": [optional],
>       "city": [optional],
>       "state": [optional],
>       "country": [optional],
>       "zipCode": [optional]
>  }
> ```

##### Responses

> | http code   | content-type          | response                                   |
> |-------------|-----------------------|--------------------------------------------|
> | 201         | application/json      | user object                                |
> | 400         | application/json      | {"code":"400","message":"Bad Request"}     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" -d '{"firstName":"john","lastName":"doe","email":"john.doe@email.com"}' http://localhost:3000/users
> ```

</details>


#### Get User

<details>
  <summary><code>GET</code> <code><b>/users/{userId}</b></code></summary>

##### Parameters

> | name   |  type      | data type      | description                                  |
> |--------|------------|----------------|----------------------------------------------|
> | userId |  required  | string         | user id obtained via create user response    |

##### Responses

> | http code     | content-type            | response                                                            |
> |---------------|-------------------------|---------------------------------------------------------------------|
> | 200           | application/json        | user object                                                         |
> | 404           | application/json        | {"code":"404","message":"could not find user with provided userId"} |

##### Example cURL

> ```javascript
>  curl -X GET http://localhost:3000/users/a234-ty09-3395-39lk-309u
> ```

</details>

#### Update User

<details>
  <summary><code>PUT</code> <code><b>/users/{userId}</b></code></summary>

##### Parameters

> | name     |  type     | data type     | description                                  |
> |----------|-----------|---------------|----------------------------------------------|
> | userId   |  required | string        | user id obtained via create user response    |
> | None     |  required | object/json   | request.body                                 |

##### Responses

> | http code     | content-type            | response                                                            |
> |---------------|-------------------------|---------------------------------------------------------------------|
> | 200           | application/json        | user object                                                         |
> | 400           | application/json        | {"code":"400","message":"Bad Request"}                              |
> | 404           | application/json        | {"code":"404","message":"could not find user with provided userId"} |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" -d '{"firstName":"john","lastName":"doe","email":"johndoe@email.com"}' http://localhost:3000/users
> ```

</details>

#### Delete User

<details>
  <summary><code>DELETE</code> <code><b>/users/{userId}</b></code></summary>

##### Parameters

> | name     |  type     | data type     | description                                  |
> |----------|-----------|---------------|----------------------------------------------|
> | userId   |  required | string        | user id obtained via create user response    |

##### Responses

> | http code     | content-type            | response                                                              |
> |---------------|-------------------------|-----------------------------------------------------------------------|
> | 200           | application/json        | empty object                                                          |
> | 404           | application/json        | {"code":"404","message":"could not delete user with provided userId"} |

##### Example cURL

> ```javascript
>  curl -X DELETE http://localhost:3000/users/a234-ty09-3395-39lk-309u
> ```

</details>


## Local setup

#### Requirements

- Node.js Version 18+
- npm (package manager)
- Mocha (to execute tests)
- Docker (to run local dynamodb)
- Serverless (install globally)
- Serverless subscription (for deployment, use free tier)
- AWS cli (for deployment)
- AWS account (for deployment)

#### Install dependencies

Install dependencies by executing the following from the root of the repository,
```
$ npm i
```

#### Tests

Start the service by executing the following from the root of the repository, 

``````
$ npm run sls_offline_start_local
``````

To execute *unit tests*, open another terminal session and execute the following from the root of the repository,

```
$ npm run test
```

Unit tests do not need the service in the background!

To execute *functional tests*, open another terminal session and execute the following from the root of the repository,

```
$ npm run ft_test
```

#### Deployment

Execute the following from the root fo the repository.

*Create a free subscription with [serverless](https://www.serverless.com/)!*

Login to serverless service (and follow the prompts, may need to enable/allow AWS integration if not already done),

```
$ sls login
```

To deploy (to AWS),

```
$ sls deploy
```

To remove deployment (remove the stack from AWS),

```
$ sls remove
```
