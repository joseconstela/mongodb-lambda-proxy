const configHelper = require('../src/helpers/config')

test('expect to get all config', () => {
  try {
    const allConfig = configHelper.getAll()
    expect(allConfig.secrets.region).toBe('eu-west-1')
    expect(allConfig.secrets.endpoint).toBe('http://localhost:4584')
    expect(allConfig.secrets.awsSecretAccessKey).toBe('123')
    expect(allConfig.secrets.awsAccessKeyId).toBe('456')
    expect(allConfig.secretsList.connectionDetails).toBe('mongodbConnectionDetailsAwsSecret')
    expect(allConfig.connection.poolSize).toBe(15)
  }
  catch (ex) {
    expect(ex).toBeFalsy()
  }
})

test('expect missing env var to fail', () => {
  delete process.env.SECRET_MONGODB_CONNECTIONDETAILS
  try {
    configHelper.getAll()
  }
  catch (ex) {
    expect(ex).toBeTruthy()
  }
})