'use strict'
const mongoHelper = require('./helpers/mongo')

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  return mongoHelper.connect()
    .then(db => mongoHelper.query(db, event))
    .then(r => {
      return { success: true, result: r }
    })
    .catch(err => {
      return { success: false, reason: err.message, error: err }
    })
}

module.exports.handler = handler

// ;
// (async() => {
//   let r = await handler({
//     collection: 'jobs_data',
//     op: 'aggregate',
//     query: [
//       {$matcsh: {name:'s-rss-schedule'}}
//     ],
//     options: {
//       fields: { name: 1 },
//     }
//   }, {}, {})

//   console.log(r)
// })()
