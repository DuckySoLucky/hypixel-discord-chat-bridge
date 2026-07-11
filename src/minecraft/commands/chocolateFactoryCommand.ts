import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class ChocolateFactoryCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("chocolatefactory")
      .setAliases(["cf", "factory", "chocolate"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { prestige, totalChocolate, currentChocolate, employees } = profile.me.chocolateFactory;
    const { bro, cousin, sis, father, grandma, dog, uncle } = employees;
    this.send(
      translate("minecraft.commands.chocolatefactory.execute.success", {
        username,
        prestige,
        currentChocolate: formatNumber(currentChocolate),
        totalChocolate: formatNumber(totalChocolate),
        bro,
        cousin,
        sis,
        father,
        grandma,
        dog,
        uncle
      })
    );
  }
}

export default ChocolateFactoryCommand;
