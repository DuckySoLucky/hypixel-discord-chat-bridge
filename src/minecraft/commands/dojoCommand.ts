import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../types/minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class DojoCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("dojo")
      .setDescription("Dojo Stats of specified user.")
      .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { belt, control, stamina, discipline, force, mastery, swiftness, tenacity } = profile.me.crimsonIsle.dojo;

    this.send(
      `${username}'s Belt: ${belt} | Best Force: ${formatNumber(force.points)} | Best Stamina: ${formatNumber(stamina.points)} | Best Mastery: ${formatNumber(
        mastery.points
      )} | Best Discipline: ${formatNumber(discipline.points)} | Best Swiftness: ${formatNumber(swiftness.points)} | Best Control: ${formatNumber(
        control.points
      )} | Best Tenacity: ${formatNumber(tenacity.points)}`
    );
  }
}

export default DojoCommand;
