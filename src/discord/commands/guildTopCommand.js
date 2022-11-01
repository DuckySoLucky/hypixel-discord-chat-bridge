module.exports = {
  name: "guildtop",
  description: "Top 10 members with the most guild experience.",
  options: [
    {
      name: "time",
      description: "Days Ago",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, client) => {
    const time = interaction.options.getString("time");
    bot.chat(`/g top ${time ? time : ""}`);
    await interaction.followUp({
      content: "Command has been executed successfully.",
      ephemeral: true,
    });
  },
};
