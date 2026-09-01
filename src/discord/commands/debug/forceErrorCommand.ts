import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission } from "../../../types/discord.js";
import { HypixelAPIRebornError } from "hypixel-api-reborn";

class ForceErrorCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("force-error")
    .setDescription("force an error")
    .addStringOption((option) => option.setName("message").setDescription("The error message").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The channel to send to")
        .setRequired(true)
        .setChoices({ name: "Bridge Bot Error", value: "bridgeBot" }, { name: "Hypixel API Reborn Error", value: "reborn" }, { name: "Generic Error", value: "generic" })
    );
  override readonly flags = [CommandFlags.DebugCommand];
  override readonly permission = CommandPermission.Admin;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const message = interaction.options.getString("message", true);
    const type = interaction.options.getString("type", true);

    switch (type) {
      case "bridgeBot":
        throw new HypixelDiscordChatBridgeError(message);
      case "reborn":
        throw new HypixelAPIRebornError(message);
      default:
        throw new Error(message);
    }
  }
}

export default ForceErrorCommand;
