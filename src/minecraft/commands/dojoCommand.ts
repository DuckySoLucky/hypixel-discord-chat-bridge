import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class DojoCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData().setName("dojo").setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { belt, control, stamina, discipline, force, mastery, swiftness, tenacity } = profile.me.crimsonIsle.dojo;
    this.send(
      translate("minecraft.commands.dojo.execute.success.message", {
        username,
        belt: translate(`minecraft.commands.dojo.execute.success.format.${belt}`),
        force: formatNumber(force.points),
        stamina: formatNumber(stamina.points),
        mastery: formatNumber(mastery.points),
        discipline: formatNumber(discipline.points),
        swiftness: formatNumber(swiftness.points),
        control: formatNumber(control.points),
        tenacity: formatNumber(tenacity.points)
      })
    );
  }
}

export default DojoCommand;
