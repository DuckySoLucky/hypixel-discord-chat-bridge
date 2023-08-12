const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: `${config.minecraft.guild.guildName}-execute`,
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
    if (user.roles.cache.has(config.discord.roles.adminRole) === false) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const command = interaction.options.getString("command");
    bot.chat(`/${command}`);

    const commandMessage = new EmbedBuilder()
      .setColor(2067276)
      .setTitle("Command has been executed successfully")
      .setDescription(`\`/${command}\`\n`)
      .setFooter({
        text: "by @duckysolucky",
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
  },
};
