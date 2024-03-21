const minecraftCommand = require("../../contracts/minecraftCommand.js");

class WhatIDoCommand extends minecraftCommand {
  constructor(minecraft, weightedActivities = {}) {
    super(minecraft);

    this.name = "whatido";
    this.aliases = ["bored", "keepmebusy", "activity"];
    this.description = "Get a random activity suggestion.";
    this.options = [];
    this.weightedActivities = weightedActivities;
  }

  async onCommand(username, message) {
    try {
      const activities = [
        "Dungeons", "Powder Grind", "Nuc Runs", "Mining", "Foraging",
        "Farming", "Fishing", "Rev Slayer", "Ender Slayer", "Wolf Slayer",
        "Blaze Slayer", "Rift", "Bestiary"
      ];

      
      const defaultWeights = Object.fromEntries(activities.map(activity => [activity, 1]));
      const weightedActivities = { ...defaultWeights, ...this.weightedActivities };

      // Example : Adjust weight for "Dungeons" activity, each entry new Row
      weightedActivities["Dungeons"] = 2;

      const totalWeight = Object.values(weightedActivities).reduce((a, b) => a + b, 0);

      let randomIndex = Math.floor(Math.random() * totalWeight);
      let chosenActivity;
      for (const activity in weightedActivities) {
        randomIndex -= weightedActivities[activity];
        if (randomIndex < 0) {
          chosenActivity = activity;
          break;
        }
      }

      this.send(`/gc ${chosenActivity}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = WhatIDoCommand;
