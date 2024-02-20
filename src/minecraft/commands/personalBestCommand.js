const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
class PersonalBestCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "personalbest";
    this.aliases = ["personalbest", "pb", "talisman"];
    this.description = "Returns the fastest time (s+) of any dungeon";
    this.options = [
      {
        name: "username",
        description: "Minecraft Username",
        required: false,
      },
      {
        name: "Floor",
        description: "Floor of dungeons (M7, F7, ect)",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    // CREDITS: by @dallincotton06 (https://github.com/dallincotton06)
    try {
      username = this.getArgs(message)[0] || username;
      let floor = this.getArgs(message)[1];
      let rank = this.getArgs(message)[2];

      if (this.getArgs(message).length === 1 || this.getArgs(message).length === 0) {
        floor = "M7";
        rank = "S+";
      }

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const dungeons = getDungeons(data.player, data.profile);

      if (dungeons == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never played dungeons on ${data.profileData.cute_name}.`;
      }

      let requested_floor = dungeons.catacombs;
      let time = 0;
      const floor_number = floor.charAt(floor.length - 1);

      if (floor.toLowerCase().startsWith("m")) {
        requested_floor = dungeons.catacombs.MASTER_MODE_FLOORS[`floor_${floor_number}`];
      } else if (floor.toLowerCase().startsWith("f")) {
        requested_floor = dungeons.catacombs.floors[`floor_${floor_number}`];
      } else if (floor.toLowerCase().startsWith("entrance")) {
        requested_floor = dungeons.catacombs.floors.entrance;
      } else {
        this.send("/gc Invalid Usage: !pb [user] [floor (m7/f4/etc)] [rank (S+, S, any)]");
        return;
      }

      if (rank.toLowerCase() === "s+") {
        time = requested_floor.fastest_s_plus;
      } else if (rank.toLowerCase() === "s") {
        time = requested_floor.fastest_s;
      } else {
        rank = "any";
        this.send("/gc Invalid Usage: !pb [user] [floor (m7/f4/etc)] [rank (S+, S, any)]");
        return;
      }

      console.log(time);
      if (time === 0) {
        this.send(`/gc ${username} has no PB on ${floor} ${rank}`);
        return;
      }

      const timeStamp = millisToMinutesAndSeconds(time);
      this.send(`/gc ${username}'s PB on ${floor} with ${rank} rank is ${timeStamp}`);
    } catch (error) {
      this.send(`/gc ERROR: ${error}`);
    }
  }
}

function millisToMinutesAndSeconds(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

module.exports = PersonalBestCommand;
