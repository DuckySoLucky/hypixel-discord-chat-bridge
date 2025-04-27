const MinecraftManager = require("./minecraft/MinecraftManager.js");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const DiscordManager = require("./discord/DiscordManager.js");
const webManager = require("./web/WebsiteManager.js");

class Application {
  constructor() {
    require("./Configuration.js");
    require("./Updater.js");
    require("./Logger.js");
    if (!existsSync("./data/")) mkdirSync("./data/", { recursive: true });
    if (!existsSync("./data/linked.json")) writeFileSync("./data/linked.json", JSON.stringify({}));
    if (!existsSync("./data/inactivity.json")) writeFileSync("./data/inactivity.json", JSON.stringify({}));
  }

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
