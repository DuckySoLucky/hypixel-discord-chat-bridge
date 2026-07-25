import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { SkyBlockMemberSlayer } from "hypixel-api-reborn";

class SlayersCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("slayer")
      .setDescription("Slayer of specified user.")
      .setAliases(["slayers"])
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const slayers = profile.me.slayers;

    const slayer = Object.keys(slayers)
      .filter((slayer) => !["activeSlayer"].includes(slayer))
      .filter((key) => key !== "activeSlayer")
      .map((slayer) => {
        const data: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
        return `${titleCase(slayer)}: ${data.level.level} (${formatNumber(data.level.xp)})`;
      });
    this.send(`${username}'s Slayer: ${slayer.join(" | ")}`);
  }
}

export default SlayersCommand;
