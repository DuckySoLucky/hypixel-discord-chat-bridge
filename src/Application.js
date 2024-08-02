const MinecraftManager = require("./minecraft/MinecraftManager.js");
const DiscordManager = require("./discord/DiscordManager.js");
const webManager = require("./web/WebsiteManager.js");
// eslint-disable-next-line no-unused-vars
const Configuration = require("./Configuration.js");
// eslint-disable-next-line no-unused-vars
const Updater = require("./Updater.js");

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.web = new webManager(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
    this.web.connect();
  }
}

module.exports = new Application();
