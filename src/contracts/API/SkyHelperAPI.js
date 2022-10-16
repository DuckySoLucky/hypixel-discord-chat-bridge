const axios = require('axios')
const config = require('../../../config.json')

async function getProfile(username, profile) {
    try {
        const response = await axios.get(`${config.api.skyHelperAPI}/profiles/${username}?key=${config.api.skyHelperKey}`)
        if(response.data.status == 404){return 'ERROR There is no player with the given UUID or name or the player has no Skyblock profiles'}
        // I have no idea what's going on here but I will keep it in case someone uses it ;-;
        if (profile != undefined) {
            for (let i = 0; i < Object.keys(response.data.data).length; i++) {
                if (response.data.data[i].name == profile) {
                    return response.data.data[i]
                } else {
                    if (i+1 >= Object.keys(response.data.data).length) {
                        return 'ERROR There is no player with the given UUID or name or the player has no Skyblock profiles'
                    }
                }
            }
        } else { 
            return response.data.data[0]
        }
    } catch (error) {
        return `ERROR ` + error
    }

}

async function getFetchur() {
    const response = await axios.get(`${config.api.skyHelperAPI}/fetchur?key=${config.api.skyHelperKey}`)
    if(response.status == 404){return 'Something went wrong, try again later.'}
    return response.data
}

module.exports = {getFetchur, getProfile};

