const axios = require('axios')
const config = require('../../../config.json')

async function getPlayerData(username) {
    const response = await axios.get(`${config.api.playerDBAPI}/${username}`)
    if(response.data.code != 'player.found'){return 'There is no player with the given UUD or name.'}
    return response.data.data.player.raw_id
}

module.exports = {getPlayerData};