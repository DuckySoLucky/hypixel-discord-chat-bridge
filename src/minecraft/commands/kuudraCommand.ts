import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber, titleCase } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class KuudraCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("kuudra")
    .setDescription("Kuudra Stats of specified user.")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const formattedKuudra = Object.entries(profile.me.currencies)
      .filter(([key]) => key.endsWith("Completions"))
      .map(([name, stat]) => ({ name: name.replaceAll("Completions", ""), stat }))
      .map(({ name, stat }) => `${titleCase(name)}: ${formatNumber(stat)}`);
    await this.send(`${username}'s ${formattedKuudra.join(" | ")}`);
  }
}

export default KuudraCommand;
