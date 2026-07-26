import HypixelDiscordChatBridgeError from "../../private/error.js";
import MinecraftCommand from "../private/commands/MinecraftCommand.js";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.js";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.js";
import prettyMilliseconds from "pretty-ms";
import { formatNumber } from "../../utils/stringUtils.js";
import { getSelectedProfile } from "../../utils/hypixelUtils.js";
import { translate } from "../../translations/TranslationsManager.js";
import type { FloorData, MinecraftManagerWithBot } from "../../types/minecraft.js";
import type { ParseKeys } from "i18next";
import type { SkyBlockMemberDungeonsFloor } from "hypixel-api-reborn";

// CREDITS: by @Kathund (https://github.com/Kathund)
class FloorCommand extends MinecraftCommand {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new MinecraftCommandData()
      .setName("floor")
      .setAliases(["f1", "f2", "f3", "f4", "f5", "f6", "f7", "m1", "m2", "m3", "m4", "m5", "m6", "m7"])
      .setOptions([new MinecraftCommandDataOption().setName("username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const floors: FloorData[] = [];
    const catacombs = profile.me.dungeons.catacombs;
    Object.keys(catacombs)
      .filter((key) => key.startsWith("floor"))
      .filter((key) => !key.endsWith("0"))
      .forEach((floor) => {
        const floorData: SkyBlockMemberDungeonsFloor | null = catacombs[floor as keyof typeof catacombs] as SkyBlockMemberDungeonsFloor | null;
        if (floorData === null) return;
        floors.push({
          id: floor.replaceAll("floor", "f"),
          timesPlayed: floorData.timesPlayed,
          fastestTimeS: floorData.fastestTimeS,
          fastestTimeSPlus: floorData.fastestTimeSPlus
        });
      });

    const masterCatacombs = profile.me.dungeons.masterCatacombs;
    Object.keys(masterCatacombs)
      .filter((key) => key.startsWith("floor"))
      .filter((key) => !key.endsWith("0"))
      .forEach((floor) => {
        const floorData: SkyBlockMemberDungeonsFloor | null = masterCatacombs[floor as keyof typeof masterCatacombs] as SkyBlockMemberDungeonsFloor | null;
        if (floorData === null) return;
        floors.push({
          id: floor.replaceAll("floor", "m"),
          timesPlayed: floorData.timesPlayed,
          fastestTimeS: floorData.fastestTimeS,
          fastestTimeSPlus: floorData.fastestTimeSPlus
        });
      });

    const floorId = message.slice(1, 3);
    const floorData = floors.find((floor) => floor.id === floorId);
    if (floorData === undefined || floorData.timesPlayed === 0) {
      throw new HypixelDiscordChatBridgeError(translate("api.hypixel.errors.failed.skyblock.no.floor", { username, floor: floorId }));
    }

    this.send(
      translate("minecraft.commands.floor.execute.success.message", {
        username,
        floor: translate(`minecraft.commands.floor.execute.success.format.${floorId}` as ParseKeys),
        timesPlayed: formatNumber(floorData.timesPlayed),
        fastestTimeSPlus: prettyMilliseconds(floorData.fastestTimeSPlus, { secondsDecimalDigits: 0 }),
        fastestTimeS: prettyMilliseconds(floorData.fastestTimeS, { secondsDecimalDigits: 0 })
      })
    );
  }
}

export default FloorCommand;
