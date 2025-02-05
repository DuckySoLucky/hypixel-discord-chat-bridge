const { EmbedBuilder } = require("discord.js");

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

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Unmute" })
      .setDescription(`Successfully executed \`/g unmute ${name}\``)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png"
      });

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
