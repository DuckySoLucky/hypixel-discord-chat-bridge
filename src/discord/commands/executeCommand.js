const config = require("../../../config.json");
// eslint-disable-next-line
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "execute",
  description: "Executes commands as the minecraft bot.",
  options: [
    {
      name: "command",
      description: "Minecraft Command",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.commandRole)) {
      const command = interaction.options.getString("command");
      bot.chat(`/${command}`);
      const commandMessage = new EmbedBuilder()
        .setColor(2067276)
        .setTitle("Command has been executed successfully")
        .setDescription(`\`/${command}\`\n`)
        .setFooter({
          text: "by DuckySoLucky#5181",
          iconURL: "https://imgur.com/tgwQJTX.png",
        });
      await interaction.followUp({ embeds: [commandMessage], ephemeral: true });
    } else {
      await interaction.followUp({
        content: "You do not have permission to run this command.",
        ephemeral: true,
      });
    }
  },
};
