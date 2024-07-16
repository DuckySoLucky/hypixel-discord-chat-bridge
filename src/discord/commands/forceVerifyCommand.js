const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { readFileSync, writeFileSync } = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "force-verify",
  description: "Connect your Discord account to Minecraft",
  moderatorOnly: true,
  verificationCommand: true,
  options: [
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: true,
    },
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) {
      throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    }

    const linked = JSON.parse(linkedData);
    if (!linked) {
      throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    }

    const [user, name] = [interaction.options.getUser("user"), interaction.options.getString("name")];

    const linkedUser = linked.find((data) => data.id === user.id);
    if (linkedUser !== undefined) {
      throw new HypixelDiscordChatBridgeError("This user is already verified.");
    }

    const uuid = await getUUID(name);

    linked.push({ id: user.id, uuid: uuid });
    writeFileSync("data/linked.json", JSON.stringify(linked, null, 2));

    const successfullyLinked = new EmbedBuilder()
      .setColor("4BB543")
      .setAuthor({ name: "Successfully linked!" })
      .setDescription(`<@${user.id}> has been successfully linked to \`${name}\``)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successfullyLinked] });

    const updateRolesCommand = require("./updateCommand.js");
    if (!updateRolesCommand) {
      throw new HypixelDiscordChatBridgeError("The update command does not exist. Please contact an administrator.");
    }
    await updateRolesCommand.execute(interaction, user);
  },
};
