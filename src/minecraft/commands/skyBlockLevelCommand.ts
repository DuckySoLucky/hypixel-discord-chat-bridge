import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

class SkyBlockLevelCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("level")
    .setDescription("Skyblock Level of specified user.")
    .setAliases(["lvl"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    await this.send(`${username}'s Skyblock Level: ${profile.me.leveling.level}`);
  }
}

export default SkyBlockLevelCommand;
