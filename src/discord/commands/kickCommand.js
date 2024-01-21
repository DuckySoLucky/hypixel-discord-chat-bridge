const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "kick",
  description: "Kick the given user from the Guild.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "reason",
      description: "Reason",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const [name, reason] = [interaction.options.getString("name"), interaction.options.getString("reason")];
    bot.chat(`/g kick ${name} ${reason}`);

    const embed = new SuccessEmbed(`Successfully kicked **${name}** from the guild.`);

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
