const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "invite",
  description: "Invites the given user to the guild.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.member;
    if (user.roles.cache.has(config.discord.roles.helperRole) === false) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const name = interaction.options.getString("name");
    bot.chat(`/g invite ${name}`);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Invite" })
      .setDescription(`Successfully executed \`/g invite ${name}\``)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
