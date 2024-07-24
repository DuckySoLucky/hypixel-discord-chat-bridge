const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { replaceVariables } = require("../../contracts/helperFunctions.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const config = require("../../../config.json");

module.exports = {
  name: "force-update-channels",
  description: "Unmutes the given user.",
  moderatorOnly: true,
  channelsCommand: true,

  execute: async (interaction, hidden = false) => {
    const hypixelGuild = await hypixelRebornAPI.getGuild("player", bot.username);
    const [channels, roles] = await Promise.all([guild.channels.fetch(), guild.roles.fetch()]);

    config.statsChannels.channels.forEach(async (channelInfo) => {
      const channel = await guild.channels.fetch(channelInfo.id);
      channel.setName(
        replaceVariables(channelInfo.name, {
          guildName: hypixelGuild.name,
          guildLevel: hypixelGuild.level,
          guildXP: hypixelGuild.experience,
          guildWeeklyXP: hypixelGuild.totalWeeklyGexp,
          guildMembers: hypixelGuild.members.length,

          discordMembers: guild.memberCount,
          discordChannels: channels.size,
          discordRoles: roles.size,
        }),
        "Updated Channels",
      );
    });

    const embed = new SuccessEmbed("The channels have been updated successfully.", {
      text: `by @kathund. | /help [command] for more information`,
      iconURL: "https://i.imgur.com/uUuZx2E.png",
    });
    if (hidden !== false) await interaction.followUp({ embeds: [embed] });
  },
};
