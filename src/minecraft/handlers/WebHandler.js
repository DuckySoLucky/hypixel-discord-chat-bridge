const Skykings = require("../../../API/utils/skykings")
const Blacklist = require("../../../API/utils/blacklist")
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");


class WebHandler {
    constructor(){

    }
    async inviteMember(username) {
        let accepted = false;
        const uuid = await getUUID(username);
        const skykings_scammer = await Skykings.lookupUUID(uuid);
        const blacklisted = await Blacklist.checkBlacklist(uuid);
        if (skykings_scammer !== true && blacklisted !== true) {
            bot.chat(`/guild accept ${username}`);
            accepted = true;
        }
        return accepted;
    }
}

module.exports = WebHandler;
