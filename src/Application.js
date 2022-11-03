const minecraftManager = require("./minecraft/MinecraftManager.js");
const discordManager = require("./discord/DiscordManager.js");

class Application {
  async register() {
    this.discord = new discordManager(this);
    this.minecraft = new minecraftManager(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
  }
}

module.exports = new Application();
