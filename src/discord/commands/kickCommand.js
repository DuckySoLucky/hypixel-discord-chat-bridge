const { SlashCommandBuilder } = require("discord.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the given user to the guild.")
    .addStringOption((option) => option.setName("username").setDescription("Minecraft Username").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(true)),
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction) => {
    const [name, reason] = [interaction.options.getString("username"), interaction.options.getString("reason")];
    bot.chat(`/g kick ${name} ${reason}`);

    const embed = new SuccessEmbed(`Successfully kicked **${name}** from the guild.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
