import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import EmbedHelper, { SuccessEmbed } from "../../private/EmbedHelper.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedUser from "../../../data/linked/LinkedUser.js";
import UpdateCommand from "./updateCommand.js";
import { type ChatInputCommandInteractionWithGuild, CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { MessageFlags } from "discord.js";
import { delay } from "../../../utils/miscUtils.js";
import { getPlayer } from "../../../utils/hypixelUtils.js";

class VerifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("verify")
    .setDescription("Connect your Discord account to Minecraft")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
  override readonly flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    try {
      const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(interaction.user.id);
      if (linkedUser !== undefined) throw new HypixelDiscordChatBridgeError(`You are already verified as ${await linkedUser.getUsername()}. Please use /unverify first`);

      const username = interaction.options.getString("username", true);
      const { socialMedia, nickname, uuid } = await getPlayer(username);
      const linkedMinecraftUser = await this.discord.application.data.linked.getUserByUUID(uuid);
      if (linkedMinecraftUser !== undefined) {
        throw new HypixelDiscordChatBridgeError(`${nickname} is already verified to <@${linkedMinecraftUser.discordId}>. Please contact an staff member to intervene`);
      }

      const discordUsername = socialMedia.discord;
      if (!discordUsername) {
        throw new HypixelDiscordChatBridgeError(`The player '${nickname}' has not linked their Discord account. Please follow the instructions below.`);
      }

      if (discordUsername.toLowerCase() !== interaction.user.username) {
        throw new HypixelDiscordChatBridgeError(
          `The player '${nickname}' has linked their Discord account to a different account ('${discordUsername}'). Please follow the instructions below.`
        );
      }

      await new LinkedUser({ discordId: interaction.user.id, uuid }, this.discord.application.data.linked).save();

      await interaction.followUp({
        embeds: [
          new SuccessEmbed()
            .setDescription(`You have Successfully linked your account to \`${nickname}\``)
            .setAuthor({ name: "Successfully linked!" })
            .setDevFooter("Kathund")
        ]
      });

      const updateCommand = new UpdateCommand(this.discord);
      await updateCommand.execute(interaction);
    } catch (error) {
      if (!(error instanceof Error)) return;
      this.discord.handleError(error, interaction);
      if (!error.message.includes("Please follow the instructions below.")) return;
      await delay(500);
      const steps = [
        "Use your Minecraft client to connect to Hypixel.",
        'Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.',
        'Click "Social Media" - this button is to the left of the Redstone block (the Status button).',
        'Click "Discord" - it is the second last option.',
        `Paste your Discord username into chat and hit enter. For reference: \`${interaction.user.username}\``,
        "You're done! Wait around 30 seconds and then try again."
      ];
      const instructions = steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n");
      await interaction.followUp({
        embeds: [
          new EmbedHelper()
            .setAuthor({ name: "Link with Hypixel Social Media" })
            .setFields({ name: "Instructions:", value: instructions })
            .setImage("https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif")
            .setDevFooter("Kathund")
        ],
        flags: MessageFlags.Ephemeral
      });
    }
  }
}

export default VerifyCommand;
