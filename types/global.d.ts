import { Guild } from "discord.js";
import { Client } from "discord.js";
import { Bot } from "mineflayer";

declare global {
  var bot: Bot;
  var client: Client;
  var guild: Guild;
}

export {};
