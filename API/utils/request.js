//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const axios = require('axios');
const headers = ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset']

module.exports = {
  makeRequest: async function makeRequest(response, url) {
    const result = await axios.get(url)

    for (const header of headers) {
      if (result.headers == header.toLowerCase()) {
        response.set(header, result.headers[header.toLowerCase()])
      }
    }

    return result
  },
  wrap: function wrap(fn) {
    return function (req, res, next) {
      return fn(req, res, next).catch(err => {
        next(err)
      })
    }
  }
}