const app = require("./../../Application.js");
const config = require("./../../../config.json")
const { EmbedBuilder } = require("discord.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
    name: "restart",
    description: "Restarts the ingame and discord bot.",
  
    execute: async (interaction) => {
        if (config.discord.commands.checkPerms === true && interaction.member.roles.cache.has(config.discord.commands.commandRole) === false) {
            throw new HypixelDiscordChatBridgeError("You do not have permission to use this command.");
          }

          const restartEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("⭕Restarting!")
          .setDescription(`**Bot will restart ingame and on discord.`)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });
    
        interaction.followUp({ embeds: [restartEmbed] });
      
          await bot.quit('restart')
          await bot.end('restart')
          await client.destroy()

        app
            .register()
            .then(() => {
            app.connect();
            })
              .catch((error) => {
            console.error(error);
             });

    },
  };
  
