const { SlashCommandBuilder } = require("discord.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute the given user.")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true)),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const name = interaction.options.getString("username");
    bot.chat(`/g unmute ${name}`);

    const embed = new SuccessEmbed(`Successfully executed \`/g unmute ${name}\``).setAuthor({ name: "Unmute" });

    await interaction.followUp({ embeds: [embed] });
  }
};
