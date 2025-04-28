const HypixelDiscordChatBridgeError = require("./errorHandler.js");
const config = require("../../config.json");
const { readFileSync } = require("fs");

function isGuildMember(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (
    config.discord.commands.checkPerms === true &&
    !(userRoles.includes(config.verification.roles.guildMember.roleId) || config.discord.commands.users.includes(user.id))
  ) {
    return false;
  }

  return true;
}

function isVerifiedMember(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (
    config.discord.commands.checkPerms === true &&
    !(userRoles.includes(config.verification.roles.verified.roleId) || config.discord.commands.users.includes(user.id))
  ) {
    return false;
  }

  return true;
}

function isLinkedMember(interaction) {
  const linkedData = readFileSync("data/linked.json");
  if (!linkedData) {
    throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
  }

  const linked = JSON.parse(linkedData.toString());
  if (!linked) {
    throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
  }

  const uuid = Object.entries(linked).find(([, value]) => value === interaction.user.id)?.[0];
  if (!uuid) {
    return false;
  }

  return true;
}

module.exports = {
  isGuildMember,
  isVerifiedMember,
  isLinkedMember
};
