const AWS = require('aws-sdk')
const configHelper = require('./config')

const config = configHelper.getAll()

const secretsmanager = new AWS.SecretsManager(config.secrets)

/**
 * 
 */
module.exports.getSecret = async (SecretId, options) => {
  return new Promise((resolve, reject) => {
    secretsmanager.getSecretValue(Object.assign({
      SecretId
    }, options || {}), (error, result) => {
      if (error) reject(error)
      try {
        resolve(result.SecretString ? JSON.parse(result.SecretString) : result)
      }
      catch (ex) {
        resolve(result)
      }
    })
  })
}