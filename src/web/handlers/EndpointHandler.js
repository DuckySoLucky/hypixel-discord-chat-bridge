const config = require("../../../config.json");
const webHandler = require("../../minecraft/handlers/WebHandler.js");

class EndpointHandler {
  constructor(server) {
    this.server = server;
  }

  registerEvents() {
    const { web } = this.server;
    const guild = config.minecraft.guild.guildName;
    web.post("/" + guild + "/invite", async (req, res) => {
      const username = req.body.username;
      const success = await webHandler.inviteMember(username);
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
