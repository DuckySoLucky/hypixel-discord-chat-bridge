//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
module.exports = (error, _, response, __) => {
  if (error.hasOwnProperty('response')) {
    switch (error.response.status) {
      case 403:
        return createJsonResponse(response, 403, 'Invalid Hypixel API token provided')

      case 404:
        return createJsonResponse(response, 404, 'The requested resource does not exist')

      case 429:
        return createJsonResponse(response, 429, 'You have hit the rate-limit, please slow down your requests')

      case 502:
        return createJsonResponse(response, 502, 'Hypixels API is currently experiencing some technical issues, try again later')

      case 504:
        return createJsonResponse(response, 504, 'Hypixels API timed out')

      case 521:
        return createJsonResponse(response, 503, 'Hypixels API is currently in maintenance mode, try again later')
    }
  }

  const jsonResponse = {
    status: 500,
    reason: error.message,
  }

  return response.status(500).json(jsonResponse)
}

function createJsonResponse(response, statusCode, reason) {
  return response.status(statusCode).json({
    status: statusCode,
    reason: reason,
  })
}