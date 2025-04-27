const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { replaceVariables } = require("../../contracts/helperFunctions.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const config = require("../../../config.json");

module.exports = {
  name: "update-channels",
  description: "Update the stats Channels",
  channelsCommand: true,
  moderatorOnly: true,
  requiresBot: true,

  execute: async (interaction, extra = {}) => {
    const hypixelGuild = await hypixelRebornAPI.getGuild("player", bot.username);
    const [channels, roles] = await Promise.all([guild.channels.fetch(), guild.roles.fetch()]);

    const stats = {
      guildName: hypixelGuild.name,
      guildLevel: hypixelGuild.level.toFixed(0),
      guildLevelWithProgress: hypixelGuild.level,
      guildXP: hypixelGuild.experience,
      guildWeeklyXP: hypixelGuild.totalWeeklyGexp,
      guildMembers: hypixelGuild.members.length,
      discordMembers: guild.memberCount,
      discordChannels: channels.size,
      discordRoles: roles.size
    };

    config.statsChannels.channels.forEach(async (channelInfo) => {
      const channel = await guild.channels.fetch(channelInfo.id);
      // console.log(`Updating channel ${channel.name} with ID ${channel.id} to ${replaceVariables(channelInfo.name, stats)}`);
      channel.setName(replaceVariables(channelInfo.name, stats), "Updated Channels");
    });

    if (!extra.hidden) {
      const embed = new SuccessEmbed("The channels have been updated successfully.").setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });

      await interaction.followUp({ embeds: [embed] });
    }
  }
};
