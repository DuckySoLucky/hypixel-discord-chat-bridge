const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { readFileSync } = require("fs");

module.exports = {
  name: "linked",
  description: "View who a user is linked to",
  moderatorOnly: true,
  verificationCommand: true,
  options: [
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: false,
    },
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const updateRolesCommand = require("./updateCommand.js");
    if (!updateRolesCommand) {
      throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
    }

    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }
    const user = interaction.options.getUser("user") || null;
    const name = interaction.options.getString("name") || null;
    if (!user && !name) {
      throw new HypixelDiscordChatBridgeError("Please provide a user or a name.");
    }
    let linkedUser;

    if (user) {
      linkedUser = linked.find((data) => data.id === user.id);
      if (linkedUser === undefined) {
        throw new HypixelDiscordChatBridgeError("This user is not linked.");
      }
    }

    if (name) {
      const uuid = await getUUID(name);
      linkedUser = linked.find((data) => data.uuid === uuid);
      if (linkedUser === undefined) {
        throw new HypixelDiscordChatBridgeError("This user is not linked.");
      }
    }

    const { nickname } = await hypixelRebornAPI.getPlayer(linkedUser.uuid);
    const Embed = new SuccessEmbed(
      `<@${linkedUser.id}> (${linkedUser.id}) is linked to \`${nickname}\` (${linkedUser.uuid}).`,
    );
    await interaction.followUp({ embeds: [Embed] });
  },
};
