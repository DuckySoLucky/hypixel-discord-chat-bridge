import { Client } from "discord.js";
import { Bot } from "mineflayer";

declare global {
  var bot: Bot;
  var client: Client;
}

export {};
