import Command from "../../Private/Commands/Command.js";
import CommandData from "../../Private/Commands/CommandData.js";
import HypixelAPIReborn from "../../../Private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../../Private/Error.js";
import LinkedUser from "../../../Linked/Private/LinkedUser.js";
import UpdateCommand from "./UpdateCommand.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../Types/Discord.js";
import { ErrorEmbed, SuccessEmbed } from "../../Private/Embed.js";
import type { ChatInputCommandInteraction } from "discord.js";

class VerifyCommand extends Command<DiscordManagerWithBot> {
  discordId: string | null;
  isSelf: boolean;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName("verify")
      .setDescription("Connect your Discord account to Minecraft")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
    this.discordId = null;
    this.isSelf = false;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }

    const linkedUser = this.discord.app.linked.getUserByDiscordId(this.discordId);
    if (linkedUser !== undefined) {
      await interaction.followUp({ embeds: [new ErrorEmbed().setDescription("User is verified\nPlease use /unverify first").setDevFooter("Kathund")] });
      return;
    }

    const username = interaction.options.getString("username");
    if (!username) throw new HypixelDiscordChatBridgeError("The \`username\` option is missing?");
    const { socialMedia, nickname, uuid } = await HypixelAPIReborn.getPlayer(username).then((playerData) => {
      if (playerData.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data.");
      return playerData;
    });

    if (!this.isSelf) {
      const discordUsername = socialMedia.discord;
      if (!discordUsername) {
        throw new HypixelDiscordChatBridgeError(`The player '${nickname}' has not linked their Discord account. Please follow the instructions below.`);
      }

      if (discordUsername.toLowerCase() !== interaction.user.username) {
        throw new HypixelDiscordChatBridgeError(
          `The player '${nickname}' has linked their Discord account to a different account ('${discordUsername}'). Please follow the instructions below.`
        );
      }
    }

    new LinkedUser({ discordId: this.discordId, uuid }, this.discord.app.linked).save();

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(`${this.isSelf ? "Your" : `<@${this.discordId}>'s`} account has been successfully linked to \`${nickname}\``)
          .setAuthor({ name: "Successfully linked!" })
          .setDevFooter("Kathund")
      ]
    });

    const updateCommand = new UpdateCommand(this.discord);
    updateCommand.isSelf = this.isSelf;
    updateCommand.discordId = this.discordId;
    await updateCommand.execute(interaction);
  }
}

export default VerifyCommand;
