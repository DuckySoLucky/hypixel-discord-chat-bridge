import DiscordCommand from "../../private/commands/DiscordCommand.js";
import DiscordCommandDataBuilder from "../../private/commands/DiscordCommandDataBuilder.js";
import HypixelDiscordChatBridgeError from "../../../private/error.js";
import { ChannelNames, type ChatInputCommandInteractionWithGuild, CommandFlags, CommandPermission, isChannelName } from "../../../types/discord.js";
import { SuccessEmbed } from "../../private/EmbedHelper.js";
import { titleCase } from "../../../utils/stringUtils.js";

class SendToChannelCommand extends DiscordCommand {
  override readonly data = new DiscordCommandDataBuilder()
    .setName("send-to-channel")
    .setDescription("Force Sending to a channel")
    .addStringOption((option) => option.setName("message").setDescription("The message to send").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send to")
        .setRequired(true)
        .setChoices(ChannelNames.map((channel) => ({ name: titleCase(channel.replaceAll("-", "_")), value: channel })))
    );
  override readonly flags = [CommandFlags.DebugCommand];
  override readonly permission = CommandPermission.Admin;

  override async execute(interaction: ChatInputCommandInteractionWithGuild) {
    const channelName = interaction.options.getString("channel", true);
    if (!isChannelName(channelName)) throw new HypixelDiscordChatBridgeError("Invalid channel name");
    const message = await (await this.discord.getChannel(channelName)).send({ content: interaction.options.getString("message", true) });
    await interaction.followUp({ embeds: [new SuccessEmbed().setDevFooter("Kathund").setDescription(`Message sent in \`${channelName}\`\n${message.url}`)] });
  }
}

export default SendToChannelCommand;
