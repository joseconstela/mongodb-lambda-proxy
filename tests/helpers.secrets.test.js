const secretsHelper = require('../src/helpers/secrets')
const configHelper = require('../src/helpers/config')

const config = configHelper.getAll()

test('expect to grab secret correctly', async() => {
  try {
    let secret = await secretsHelper.getSecret(config.secretsList.connectionDetails)
    expect(secret).toMatchObject({
      username: 'jon',
      password: 'snow',
      port: '27017',
      hostname: 'localhost',
      database: 'testing',
      query: 'retryWrites=true&w=majority'
    })
  }
  catch (ex) {
    expect(ex).toBeFalsy()
  }
})

test('expect to grab invalid secret throws error', async() => {
  try {
    let secret = await secretsHelper.getSecret('random-secret')
    expect(secret).toBeFalsy()
  }
  catch (ex) {
    expect(ex).toBeTruthy()
  }
})