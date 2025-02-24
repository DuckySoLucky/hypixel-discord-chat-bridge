const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { MessageFlags } = require("discord.js");

module.exports = {
  name: "execute",
  description: "Executes commands as the minecraft bot.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "command",
      description: "Minecraft Command",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction) => {
    const command = interaction.options.getString("command");
    bot.chat(`/${command}`);

    const commandMessage = new SuccessEmbed(`Successfully executed \`/${command}\``);

    await interaction.followUp({ embeds: [commandMessage], flags:MessageFlags.Ephemeral});
  }
};
