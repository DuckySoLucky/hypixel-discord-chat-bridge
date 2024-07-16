const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { writeFileSync, readFileSync } = require("fs");
const config = require("../../../config.json");

module.exports = {
  name: "unverify",
  description: "Remove your linked Minecraft account",
  verificationCommand: true,

  execute: async (interaction, user) => {
    user = await guild.members.fetch(user ?? interaction.user);
    if (user === undefined) {
      throw new HypixelDiscordChatBridgeError("No user found.");
    }
    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    let linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const linkedUser = linked.find((data) => data.id === user.id);
    if (linkedUser === undefined) {
      throw new HypixelDiscordChatBridgeError("You are not verified. Please run /verify to continue.");
    }

    linked = linked.filter((data) => data.id !== user.id);
    writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));
    user.setNickname(null, "Unverfied").catch((_) => {});
    user.roles.remove(config.verification.role, "Unverfied").catch((_) => {});
    user.roles.remove(config.verification.guildMemberRole, "Unverfied").catch((_) => {});
    const updateRole = new SuccessEmbed(
      "You have successfully unlinked your Minecraft account. Run `/verify` to link a new account.",
    );
    await interaction.followUp({ embeds: [updateRole] });
  },
};
