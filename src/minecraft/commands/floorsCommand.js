const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const prettyms = require("pretty-ms");

// CREDITS: by @Hypixel-API-Reborn (https://github.com/Hypixel-API-Reborn/hypixel-api-reborn/blob/49fcb3ee965a492fc74b38db881e77da1720f340/src/Structures/SkyBlock/Member/Dungeons/SkyBlockMemberDungeonsFloor.ts)
class SkyBlockMemberDungeonsFloor {
  /**
   * @param {Record<string,any>} data
   * @param {string} floorNumber
   **/
  constructor(data, floorNumber) {
    this.timesPlayed = data?.tier_completions?.[floorNumber] || 0;
    this.fastestTimeS = data?.fastest_time_s?.[floorNumber] || 0;
    this.fastestTimeSPlus = data?.fastest_time_s_plus?.[floorNumber] || 0;
  }
}

// CREDITS: by @Hypixel-API-Reborn (https://github.com/Hypixel-API-Reborn/hypixel-api-reborn/blob/49fcb3ee965a492fc74b38db881e77da1720f340/src/Structures/SkyBlock/Member/Dungeons/SkyBlockMemberDungeonsMode.ts)
class SkyBlockMemberDungeonsMode {
  /**
   * @param {Record<string,any>} data
   * @param {string} type
   **/
  constructor(data, type) {
    this.floor1 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "1");
    this.floor2 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "2");
    this.floor3 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "3");
    this.floor4 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "4");
    this.floor5 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "5");
    this.floor6 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "6");
    this.floor7 = new SkyBlockMemberDungeonsFloor(data?.[type] || {}, "7");
  }
}

class FloorsCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "floor";
    this.aliases = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "m1", "m2", "m3", "m4", "m5", "m6", "m7"];
    this.description = "Returns stats about a floor";
    this.options = [{ name: "username", description: "Minecraft Username", required: false }];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);
      // @ts-ignore
      const floors = [];
      const catacombs = new SkyBlockMemberDungeonsMode(profile?.dungeons?.dungeon_types ?? {}, "catacombs");
      Object.keys(catacombs)
        .filter((key) => key.startsWith("floor"))
        .filter((key) => !key.endsWith("0"))
        .forEach((floor) => {
          // @ts-ignore
          const floorData = catacombs[floor];
          if (floorData === null) return;
          floors.push({
            id: floor.replaceAll("floor", "f"),
            timesPlayed: floorData.timesPlayed,
            fastestTimeS: floorData.fastestTimeS,
            fastestTimeSPlus: floorData.fastestTimeSPlus
          });
        });

      const masterCatacombs = new SkyBlockMemberDungeonsMode(profile?.dungeons?.dungeon_types ?? {}, "master_catacombs");
      Object.keys(masterCatacombs)
        .filter((key) => key.startsWith("floor"))
        .filter((key) => !key.endsWith("0"))
        .forEach((floor) => {
          // @ts-ignore
          const floorData = masterCatacombs[floor];
          if (floorData === null) return;
          floors.push({
            id: floor.replaceAll("floor", "m"),
            timesPlayed: floorData.timesPlayed,
            fastestTimeS: floorData.fastestTimeS,
            fastestTimeSPlus: floorData.fastestTimeSPlus
          });
        });

      const floorId = message.slice(1, 3);
      // @ts-ignore
      const floorData = floors.find((floor) => floor.id === floorId);

      if (floorData === undefined || floorData.timesPlayed === 0) {
        throw `${username} has never done ${floorId} before.`;
      }

      this.send(
        `${username}'s ${floorId} completions ${floorData.timesPlayed} | S+: ${prettyms(floorData.fastestTimeSPlus, { secondsDecimalDigits: 0 })} | S: ${prettyms(floorData.fastestTimeS, { secondsDecimalDigits: 0 })}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = FloorsCommand;
