const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "unmute",
  description: "Unmutes the given user.",
  moderatorOnly: true,
  requiresBot: true,
  options: [
    {
      name: "username",
      description: "Minecraft Username",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction) => {
    const name = interaction.options.getString("username");
    bot.chat(`/g unmute ${name}`);

    const embed = new SuccessEmbed(`Successfully executed \`/g unmute ${name}\``).setAuthor({ name: "Unmute" });

    await interaction.followUp({ embeds: [embed] });
  }
};
