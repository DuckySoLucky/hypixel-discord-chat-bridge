const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const AuthProvider = require("../AuthProvider.js");

module.exports = {
  name: "scf-execute",
  description: "Executes commands as the minecraft bot.",
  options: [
    {
      name: "command",
      description: "Minecraft Command",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    const permission_required = 'execute';

    let permission = false;

    const AuthData = new AuthProvider();
    permission = (await AuthData.permissionInfo(user)).permissions?.[permission_required] ?? false;

    if (!permission) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command, or the Permission API is Down.");
    }

    const command = interaction.options.getString("command");
    bot.chat(`/${command}`);

    const commandMessage = new EmbedBuilder()
      .setColor(2067276)
      .setTitle("Command has been executed successfully")
      .setDescription(`\`/${command}\`\n`)
      .setFooter({
        text: "/help for more info",
        iconURL: config.minecraft.API.SCF.logo,
      });

    await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
  },
};
