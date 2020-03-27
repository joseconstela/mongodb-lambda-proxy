const secretsHelper = require('../src/helpers/secrets')
const configHelper = require('../src/helpers/config')
const mongoHelper = require('../src/helpers/mongo')

const config = configHelper.getAll()

test('expect to get full connection string', async() => {
  try {
    let secret = await secretsHelper.getSecret(config.secretsList.connectionDetails)
    let result = mongoHelper.buildUrl(secret)
    expect(result).toBe('mongodb://jon:snow@localhost:27017/testing?retryWrites=true&w=majority')
  }
  catch (ex) {
    expect(ex).toBeFalsy()
  }
})

test('expect to get full connection string without password', async() => {
  try {
    let fullSecret = await secretsHelper.getSecret(config.secretsList.connectionDetails)
    let secret = Object.assign({}, fullSecret, {password: null})
    let result = mongoHelper.buildUrl(secret)
    expect(result).toBe('mongodb://jon@localhost:27017/testing?retryWrites=true&w=majority')
  }
  catch (ex) {
    expect(ex).toBeFalsy()
  }
})

test('expect to get full connection string without authentication', async() => {
  try {
    let fullSecret = await secretsHelper.getSecret(config.secretsList.connectionDetails)
    let secret = Object.assign({}, fullSecret, {password: null, username: null})
    let result = mongoHelper.buildUrl(secret)
    expect(result).toBe('mongodb://localhost:27017/testing?retryWrites=true&w=majority')
  }
  catch (ex) {
    expect(ex).toBeFalsy()
  }
})

test('expect to get full connection string without query', async() => {
  try {
    let fullSecret = await secretsHelper.getSecret(config.secretsList.connectionDetails)
    let secret = Object.assign({}, fullSecret, {query: null})
    let result = mongoHelper.buildUrl(secret)
    expect(result).toBe('mongodb://jon:snow@localhost:27017/testing')
  }
  catch (ex) {
    expect(ex).toBeFalsy()
  }
})