const DiscordManager = require("./discord/DiscordManager.js");
const MinecraftManager = require("./minecraft/MinecraftManager.js");
const webManager = require("./web/WebsiteManager.js");
const ReplicationManager = require("./replication/ReplicationManager.js");
const config = require("../config.json");

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.web = new webManager(this);

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);

    if (config.discord.replication.enabled) {
      this.replication = new ReplicationManager(this);

      this.replication.setBridge(this.minecraft);
      this.replication.setBridge(this.discord);

      this.discord.setBridge(this.replication);
      this.minecraft.setBridge(this.replication);
    }
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
    if (config.discord.replication.enabled) {
      this.replication.connect();
    }
  }
}

module.exports = new Application();
