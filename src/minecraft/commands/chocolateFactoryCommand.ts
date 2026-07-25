import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class ChocolateFactoryCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("chocolatefactory")
      .setDescription("Skyblock Chocolate Factory Stats of specified user.")
      .setAliases(["cf", "factory", "chocolate"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { prestige, totalChocolate, currentChocolate, employees } = profile.me.chocolateFactory;
    const { bro, cousin, sis, father, grandma, dog, uncle } = employees;

    this.send(
      `${username}'s Chocolate Prestige: ${prestige} | Chocolate: ${formatNumber(currentChocolate)} | Total Chocolate: ${formatNumber(
        totalChocolate
      )} | Employees: Bro: ${bro}, Cousin: ${cousin}, Sis: ${sis}, Father: ${father}, Grandma: ${grandma}, Dog: ${dog}, Uncle: ${uncle}`
    );
  }
}

export default ChocolateFactoryCommand;
