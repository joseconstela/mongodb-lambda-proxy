const MongoClient = require('mongodb').MongoClient

const configHelper = require('./config')
const secretsHelper = require('./secrets')

let cachedDb = null

const buildUrl = opts => {
  let connectionString = opts.connectionString

  if (!connectionString) {
    connectionString = `mongodb://`

    if (opts.username) {
      connectionString += encodeURIComponent(opts.username)
      if (opts.password) connectionString += `:${encodeURIComponent(opts.password)}`
      connectionString += '@'
    }

    connectionString += opts.hostname

    if (opts.port) connectionString += `:${opts.port}`
    if (opts.database) connectionString += `/${opts.database}`
    if (opts.query) connectionString += `?${opts.query}`
  }

  return connectionString
}

module.exports.buildUrl = buildUrl

const connect = async (uri, forceDetails) => {
  if (cachedDb) {
    return Promise.resolve(cachedDb)
  }

  const config = configHelper.getAll()

  forceDetails = {
    hostname: 'localhost',
    port: 3001,
    database: 'meteor'
  }

  const connectionDetails = forceDetails || await secretsHelper.getSecret(config.secretsList.connectionDetails)
  
  return MongoClient.connect(buildUrl(connectionDetails), {
      poolSize: config.connection.poolSize,
      useNewUrlParser: true
    })
    .then(client => {
      cachedDb = client.db(connectionDetails.database)
      return cachedDb
    })
}

module.exports.connect = connect

const query = async (db, opts) => {
  const collection = db.collection(opts.collection)
  let op = await collection[opts.op](opts.query, opts.options)

  const className = op.constructor.name

  switch(className) {
    case 'Cursor':
    case 'AggregationCursor':
      return op.toArray()
    case 'CommandResult':
      return op.result
    default:
      return op
  }
}

module.exports.query = query