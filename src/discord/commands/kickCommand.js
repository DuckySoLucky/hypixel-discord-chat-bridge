const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "kick",
  description: "Kick the given user from the Guild.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "username",
      description: "Minecraft Username",
      type: 3,
      required: true
    },
    {
      name: "reason",
      description: "Reason",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction) => {
    const [name, reason] = [interaction.options.getString("username"), interaction.options.getString("reason")];
    bot.chat(`/g kick ${name} ${reason}`);

    const embed = new SuccessEmbed(`Successfully kicked **${name}** from the guild.`);

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
