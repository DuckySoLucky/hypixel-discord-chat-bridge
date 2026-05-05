const { formatNumber, replaceVariables } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { getPlayerVariableStats } = require("../../contracts/getVariableStats.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

async function updateRoles({ discordId, uuid }) {
  const member = await guild.members.fetch(discordId);
  if (!member) {
    return;
  }

  if (guild.ownerId === member.user.id) throw new HypixelDiscordChatBridgeError("This user owns the server thus the bot cannot update it");

  const verificationRoles = config.verification.roles;
  const roles = [verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId)];
  const addedRoles = [];

  if (!uuid) {
    if (config.verification.nickname.enabled) member.setNickname(null, "Updated Roles");
    if (verificationRoles.verified.enabled && member.roles.cache.has(verificationRoles.verified.roleId)) {
      await member.roles.remove(verificationRoles.verified.roleId, "Updated Roles");
      // console.log("Removed verified role");
    }

    throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
  }

  if (verificationRoles.verified.enabled) {
    await member.roles.add(verificationRoles.verified.roleId, "Updated Roles");
    addedRoles.push(verificationRoles.verified.roleId);
    // console.log("Added verified role");
  }

  const [hypixelGuild, player, skyblock] = await Promise.all([
    hypixelRebornAPI.getGuild("player", bot.username, { noCaching: true, noCacheCheck: true }),
    hypixelRebornAPI.getPlayer(uuid),
    getLatestProfile(uuid, { museum: true }).catch(() => ({ profile: null, profileData: null }))
  ]);

  if (hypixelGuild === undefined) {
    throw new HypixelDiscordChatBridgeError("Guild not found.");
  }

  const stats = await getPlayerVariableStats(uuid, hypixelGuild, player, skyblock);

  const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);
  if (guildMember) {
    if (verificationRoles.guildMember.enabled) {
      await member.roles.add(verificationRoles.guildMember.roleId, "Updated Roles");
      addedRoles.push(verificationRoles.guildMember.roleId);
      // console.log("Added guild member role");
    }

    const guildRank = verificationRoles.custom.find((r) =>
      r.requirements
        .filter((req) => r.enabled !== false && req.type === "guildRank")
        .map((req) => req.value)
        .includes(guildMember.rank)
    );
    if (guildRank && guildRank.enabled !== false) {
      await member.roles.add(guildRank.roleId, "Updated Roles");
      addedRoles.push(guildRank.roleId);

      // console.log(`Added ${(await guild.roles.fetch(guildRank.roleId)).name}`);
    }
  } else {
    if (verificationRoles.guildMember.enabled) {
      await member.roles.remove(verificationRoles.guildMember.roleId, "Updated Roles");
      // console.log("Removed guild member role");
    }
  }

  if (verificationRoles.custom.length > 0) {
    for (const role of verificationRoles.custom.filter((r) => r.requirements.some((req) => req.type !== "guildRank"))) {
      if (role.enabled === false) {
        continue;
      }

      const meetsRequirements = role.requirements.every((req) => req.value <= stats[req.type]);
      if (meetsRequirements) {
        await member.roles.add(role.roleId, "Updated Roles");
        addedRoles.push(role.roleId);
        // console.log(
        //   `Added ${(await guild.roles.fetch(role.roleId)).name} cuz he meets the requirements for ${role.requirements.map((req) => `${req.type} >= ${req.value}`).join(" and ")}`
        // );
      }
    }
  }

  if (config.verification.nickname.enabled) {
    member.setNickname(
      replaceVariables(
        config.verification.nickname.nickname,
        Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? formatNumber(value) : value]))
      ).replace(/,/g, config.verification.nickname.removeCommas ? "" : ","),
      "Updated Roles"
    );
  }

  for (const role of roles) {
    if (addedRoles.includes(role)) return;
    if (member.roles.cache.has(role)) {
      await member.roles.remove(role, "Updated Roles");
      // console.log(`Removed ${(await guild.roles.fetch(role)).name}`);
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder().setName("update").setDescription("Update your current roles"),
  verificationCommand: true,

  execute: async (interaction, extra = { discordId: null, hidden: false }) => {
    try {
      const linkedData = fs.readFileSync("data/linked.json");
      if (!linkedData) {
        throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
      }

      const linked = JSON.parse(linkedData.toString());
      if (!linked) {
        throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
      }

      const discordId = extra.discordId ?? interaction.user.id;
      const uuid = Object.entries(linked).find(([, value]) => value === discordId)?.[0];
      if (!uuid) {
        throw new HypixelDiscordChatBridgeError("You are not linked to a Minecraft account.");
      }

      await updateRoles({ discordId, uuid });

      if (!extra.hidden) {
        const updateRole = new SuccessEmbed(
          `Successfully synced ${extra.discordId ? `<@${extra.discordId}>` : "your"} roles with \`${await getUsername(uuid)}\`'s stats!`
        ).setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

        await interaction.followUp({ embeds: [updateRole], flags: MessageFlags.Ephemeral });
      }
    } catch (error) {
      console.log(error);
      if (!extra.hidden) {
        const errorEmbed = new ErrorEmbed(`\`\`\`${error}\`\`\``).setFooter({
          text: `by @.kathund | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png"
        });

        await interaction.editReply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
      }
    }
  },

  updateRoles
};
