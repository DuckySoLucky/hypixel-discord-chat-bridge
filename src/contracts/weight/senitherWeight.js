const { getPlayerData } = require('../API/PlayerDBAPI')
const config = require('../../../config.json')
const axios = require('axios')

async function getSenitherWeight(uuid) {
  const weight = (await axios.get(`https://hypixel-api.senither.com/v1/profiles/${uuid}/weight?key=${config.api.hypixelAPIkey}`)).data
  return weight
}

async function getSenitherWeightUsername(username) {
  const uuid = await getPlayerData(username)
  const weight = (await axios.get(`https://hypixel-api.senither.com/v1/profiles/${uuid}/weight?key=${config.api.hypixelAPIkey}`)).data.data
  return weight
}

module.exports = { getSenitherWeight, getSenitherWeightUsername }
