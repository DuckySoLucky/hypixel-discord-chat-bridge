const config = require("../../../config.json");
const {getUUID} = require("../../contracts/API/PlayerDBAPI");
const Skykings = require("../../../API/utils/skykings");
const Blacklist = require("../../../API/utils/blacklist");

class EndpointHandler {
  constructor(server) {
    this.server = server;
  }

  registerEvents() {
    const { web } = this.server;
    const guild = config.minecraft.guild.guildName;
    web.post("/" + guild + "/invite", async (req, res) => {
      if(config.web.endpoints.invite === false) return;
      const username = req.body.username;
      let success = false;
      const uuid = await getUUID(username);
      const skykings_scammer = await Skykings.lookupUUID(uuid);
      const blacklisted = await Blacklist.checkBlacklist(uuid);
      if (skykings_scammer !== true && blacklisted !== true) {
        bot.chat(`/guild invite ${username}`);
        success = true;
      }
      if(!success) {
        res.send({
          "success": success,
          "reason": "Player lookup failed OR another internal error occured"
        });
        return;
      }
      res.send({
        "success": success
      });
    });

    web.post("/" + guild + "/kick", async (req, res) => {
      if(config.web.endpoints.kick === false) return;
      const username = req.body.username;
      const reason = req.body.reason;
      let success = false;
      bot.chat("/g kick " + username + " " + reason);
      success = true;
      if(!success) {
        res.send({
          "success": success,
          "reason": "Player lookup failed OR another internal error occured"
        });
        return;
      }
      res.send({
        "success": success
      });
    });
  }
}

module.exports = EndpointHandler;
