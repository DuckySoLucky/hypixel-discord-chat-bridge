// eslint-disable-next-line no-unused-vars
const { GuildMember } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   */
  async execute(member) {
    try {
      if (member.user.bot || config.verification.enabled === false) return;
      await member.roles.add(config.verification.unverifiedRole, "Updated Roles");
    } catch (error) {
      console.log(error);
    }
  },
};
