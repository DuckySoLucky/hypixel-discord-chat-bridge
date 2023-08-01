const { EmbedBuilder } = require("discord.js");
const Logger = require("../.././Logger.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        bridgeChat = interaction.channelId;

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction, interaction.client);
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
