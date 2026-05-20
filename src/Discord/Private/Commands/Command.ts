import { type AutocompleteInteraction, type ChatInputCommandInteraction } from "discord.js";
import { CommandFlags, CommandResponse, CommandType, type DiscordManagerWithClient } from "../../../Types/Discord.js";
import type CommandData from "./CommandData.js";
import type DiscordManager from "../../DiscordManager.js";

class Command<T extends DiscordManager = DiscordManagerWithClient> {
  protected readonly discord: T;
  data!: CommandData;
  flags: CommandFlags[];
  response: CommandResponse;
  type: CommandType;
  constructor(discord: T) {
    this.discord = discord;
    this.flags = [];
    this.response = CommandResponse.Public;
    this.type = CommandType.Global;
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> | void {
    throw new Error("Execute Method not implemented!");
  }

  autocomplete(interaction: AutocompleteInteraction): Promise<void> | void {
    throw new Error("Auto Complete Method not implemented!");
  }
}

export default Command;
