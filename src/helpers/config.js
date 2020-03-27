/**
 * 
 */
module.exports.getAll = () => {
  [
    'SECRET_MONGODB_CONNECTIONDETAILS'
  ].map(v => {
    if (!process.env[v]) throw new Error(`Environment variable ${v} not set`)
    return true
  })

  return {
    secrets: {
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.SECRETS_ENDPOINT,
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID
    },
    connection: {
      poolSize: process.env.MONGODB_POOLSIZE ? parseInt(process.env.MONGODB_POOLSIZE) : 5
    },
    secretsList: {
      connectionDetails: process.env.SECRET_MONGODB_CONNECTIONDETAILS
    }
  }
}