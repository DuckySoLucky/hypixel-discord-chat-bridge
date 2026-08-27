import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class ChocolateFactoryCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("chocolatefactory")
    .setDescription("Skyblock Chocolate Factory Stats of specified user.")
    .setAliases(["cf", "factory", "chocolate"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { prestige, totalChocolate, currentChocolate, employees } = profile.me.chocolateFactory;
    const formattedEmployees = Object.entries(employees)
      .map(([name, level]) => ({ name, level }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, level }) => `${titleCase(name)}: ${formatNumber(level)}`);

    await this.send(
      `${username}'s Chocolate Prestige: ${prestige} | Chocolate: ${formatNumber(currentChocolate)} | Total Chocolate: ${formatNumber(
        totalChocolate
      )} | Employees: ${formattedEmployees.join(", ")}`
    );
  }
}

export default ChocolateFactoryCommand;
