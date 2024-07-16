const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const { readFileSync } = require("fs");

module.exports = {
  name: "update",
  verificationCommand: true,
  description: "Update your current roles",

  execute: async (interaction, user, hidden = false) => {
    user = await guild.members.fetch(user ?? interaction.user);
    if (user === undefined) {
      throw new HypixelDiscordChatBridgeError("No user found.");
    }

    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const linkedUser = linked.find((data) => data.id === user.id);
    if (linkedUser === undefined) {
      user.setNickname(null, "Updated Roles").catch((_) => {});
      user.roles.remove(config.verification.role, "Updated Roles").catch((_) => {});
      user.roles.remove(config.verification.guildMemberRole, "Updated Roles").catch((_) => {});
      const embed = new EmbedBuilder().setDescription(`<@${user.id}> is not verified.`).setColor(15548997).setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });
      return await interaction.followUp({ embeds: [embed] });
    }

    const [guild, player] = await Promise.all([
      hypixelRebornAPI.getGuild("player", bot.username).catch(() => undefined),
      hypixelRebornAPI.getPlayer(linkedUser.uuid).catch(() => undefined),
    ]).catch((e) => {
      console.log(e);
    });

    if (guild === undefined) {
      throw new HypixelDiscordChatBridgeError("Guild not found.");
    }

    const playerIsInGuild = guild.members.find((m) => m.uuid == linkedUser.uuid);
    if (playerIsInGuild) {
      user.roles.add(config.verification.guildMemberRole, "Updated Roles").catch((_) => {});
    } else {
      user.roles.remove(config.verification.guildMemberRole, "Updated Roles").catch((_) => {});
    }

    if (user.roles.cache.find((r) => r.id === config.verification.role) === undefined) {
      user.roles.add(config.verification.role, "Updated Roles").catch((_) => {});
    }

    user.setNickname(player.nickname, "Updated Roles").catch((_) => {});

    const updateRole = new SuccessEmbed(
      `<@${user.id}>'s roles have been successfully synced with \`${player.nickname ?? "Unknown"}\`!`,
    );
    if (hidden !== null) await interaction.followUp({ embeds: [updateRole], ephemeral: hidden });
  },
};
