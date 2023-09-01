const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
    name: `${config.minecraft.guild.guildName}-masskick`,
    description: "Kick the given users from the Guild.",
    options: [
        {
            name: "names",
            description: "Minecraft Usernames to kick, separated by spaces",
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
        if (user.roles.cache.has(config.discord.roles.modRole) === false) {
            throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
        }

        const [nameList, reason] = [interaction.options.getString("names"), interaction.options.getString("reason")];
        const names = nameList.split(' ');
        for(let name of names) {
            console.log(name);
            bot.chat("/g kick " + name + " " + reason);
        }

        const embed = new EmbedBuilder()
            .setColor(5763719)
            .setAuthor({ name: "Kick" })
            .setDescription(`Successfully executed \`/g kick ${name} ${reason}\``)
            .setFooter({
                text: `by @duckysolucky | /help [command] for more information`,
                iconURL: "https://imgur.com/tgwQJTX.png",
            });

        await interaction.followUp({
            embeds: [embed],
        });
    },
};
