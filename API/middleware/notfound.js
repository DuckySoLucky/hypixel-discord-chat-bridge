//CREDIT: https://github.com/Senither/hypixel-skyblock-facade
module.exports = (_, response) => {
  return response.status(404).json({
    status: 404,
    reason: 'Route not found',
  })
}