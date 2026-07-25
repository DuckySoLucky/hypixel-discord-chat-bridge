import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandData from "../../private/commands/DiscordCommandData.js";
import Embed, { SuccessEmbed } from "../../private/Embed.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import LinkedUser from "../../../data/linked/LinkedUser.js";
import UpdateCommand from "./updateCommand.js";
import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../../types/discord.js";
import { delay } from "../../../utils/miscUtils.js";
import { getPlayer } from "../../../utils/hypixelUtils.js";

class VerifyCommand extends DiscordCommand<DiscordManagerWithBot> {
  discordId: string | null = null;
  isSelf: boolean = false;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new DiscordCommandData()
      .setName("verify")
      .setDescription("Connect your Discord account to Minecraft")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true));
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (this.discordId === null) {
        this.isSelf = true;
        this.discordId = interaction.user.id;
      }

      if (!interaction.guild || !this.discordId) throw new HypixelDiscordChatBridgeError("Please run this command inside of a guild");
      const discordUser = await interaction.guild.members.fetch(this.discordId).catch((e) => console.error(e));
      if (!discordUser) throw new HypixelDiscordChatBridgeError("This discord user doesn't exist");

      const linkedUser = await this.discord.application.data.linked.getUserByDiscordId(this.discordId);
      if (linkedUser !== undefined) throw new HypixelDiscordChatBridgeError("User is verified. Please use /unverify first");

      const username = interaction.options.getString("username", true);
      const { socialMedia, nickname, uuid } = await getPlayer(username);

      if (this.isSelf) {
        const discordUsername = socialMedia.discord;
        if (!discordUsername) {
          throw new HypixelDiscordChatBridgeError(`The player '${nickname}' has not linked their Discord account. Please follow the instructions below.`);
        }

        if (discordUsername.toLowerCase() !== discordUser.user.username) {
          throw new HypixelDiscordChatBridgeError(
            `The player '${nickname}' has linked their Discord account to a different account ('${discordUsername}'). Please follow the instructions below.`
          );
        }
      }

      await new LinkedUser({ discordId: this.discordId, uuid }, this.discord.application.data.linked).save();

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
          new Embed()
            .setAuthor({ name: "Link with Hypixel Social Media" })
            .setFields([{ name: "Instructions:", value: instructions }])
            .setImage("https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif")
            .setDevFooter("Kathund")
        ],
        flags: MessageFlags.Ephemeral
      });
    }

    this.discordId = null;
    this.isSelf = false;
  }
}

export default VerifyCommand;
