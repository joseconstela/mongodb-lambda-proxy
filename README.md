# MongoDB Lambda proxy (aka Proxy)

> A Lambda function that serves as a database connection proxy.

_Designed for AWS_

With MongoDB Lambda Proxy, your Lambda functions don't need to establish its
own database connection. Instead, they will invoke "Proxy", sending the query
parameters. Once invoked, the Proxy will run the query using the standard
MongoDB Node.js driver, and reply back with the query results.

See [webiny's blog](https://blog.webiny.com/using-aws-lambda-to-create-a-mongodb-connection-proxy-2bb53c4a0af4)
to understand more about the problem that Proxy solves.

## Usage

### As a library

```javascript
let r = await proxy.handler({
  collection: 'users',
  op: 'findOne',
  query: {
    name: 'Jon'
  },
  options: {
    fields: { email: 1 },
  }
}, {}, {})

console.log(r)

// { success: true, result: { email: 'jon@example.com' } }
```

### As a Lambda function

```javascript

  const dbQuery = {
    collection: 'users',
    op: 'findOne',
    query: {
      name: 'Jon'
    },
    options: {
      fields: { email: 1 },
    }
  }

  return new Promise((resolve, reject) => {
      var params = {
          FunctionName: 'myDbProxyFunctionName',
          InvocationType: 'RequestResponse',
          LogType: 'None',
          Payload: JSON.stringify(dbQuery)
      }
      lambda.invoke(params, (err, result) => {
        if (err) return reject(err)
        const response = JSON.parse(result.Payload)
        if (!response.success) return reject({
          reason: response.reason,
          error: response.error
        })
        return resolve(response.result)
      })
  })

  // Example outputs:
  //
  // Resolves: { email: 'jon@example.com' }
  // Resolves: [ { email: 'jon@example.com' } ]
  // Rejects: { reason: 'Unrecognized pipeline stage name: \'$matcsh\'', error: '......' }
  // Rejects: { reason: 'failed to connect to server...', error: '......' }
```

## Installation process

1. Create an AWS Secret with the database connection details (see below).
2. Create the Lambda function. Specify an environment variable
`SECRET_MONGODB_CONNECTIONDETAILS` with the name of the secret you have
previously created.
3. Make sure that your Lambda function have access to Secret Manager. (IAM)

## Environment variables

- `SECRET_MONGODB_CONNECTIONDETAILS` _required_ name of the secret where the
connection details are stored.
- `MONGODB_POOLSIZE` _optional_ size of connection pool. Defaults to 5

## Security

For improved security, you must specify the connection details via a AWS Secret,
with the following format:

```json
  {
    "username": "jon",
    "password": "snow",
    "port": "27017",
    "hostname": "localhost",
    "database": "testing",
    "query": "retryWrites=true&w=majority"
  }
```
