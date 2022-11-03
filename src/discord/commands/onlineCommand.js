module.exports = {
  name: "online",
  description: "List of online members.",

  execute: async (interaction, client) => {
    bot.chat(`/g online`);
    await interaction.followUp({
      content: "Command has been executed successfully.",
      ephemeral: true,
    });
  },
};
