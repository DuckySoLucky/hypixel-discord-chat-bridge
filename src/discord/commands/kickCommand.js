const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "kick",
  description: "Kick the given user from the Guild.",
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
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
    }

    const [name, reason] = [interaction.options.getString("name"), interaction.options.getString("reason")];
    bot.chat(`/g kick ${name} ${reason}`);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(config.discord.other.colors.success)
          .setAuthor({ name: "Kick" })
          .setDescription(`Successfully executed \`/g kick ${name} ${reason}\``)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          }),
      ],
    });
  },
};
