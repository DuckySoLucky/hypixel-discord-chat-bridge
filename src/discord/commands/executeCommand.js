const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("execute")
    .setDescription("Executes commands as the minecraft bot.")
    .addStringOption((option) => option.setName("command").setDescription("Minecraft Command").setRequired(true)),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const command = interaction.options.getString("command");
    bot.chat(`/${command}`);

    const commandMessage = new SuccessEmbed(`Successfully executed \`/${command}\``);

    await interaction.followUp({ embeds: [commandMessage], flags: MessageFlags.Ephemeral });
  }
};
