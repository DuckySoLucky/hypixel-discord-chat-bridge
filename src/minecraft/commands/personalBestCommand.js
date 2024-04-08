const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getDungeons = require("../../../API/stats/dungeons.js");
class PersonalBestCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "personalbest";
    this.aliases = ["personalbest", "pb"];
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
      const floor = (this.getArgs(message)[1] ?? "M7").toLowerCase();
      const rank = (this.getArgs(message)[2] ?? "S+").toLowerCase();

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const dungeons = getDungeons(data.player, data.profile);

      if (dungeons == null) {
        // eslint-disable-next-line no-throw-literal
        throw `${username} has never played dungeons on ${data.profileData.cute_name}.`;
      }

      let requested_floor = dungeons.catacombs;
      let time = 0;
      const floor_type = floor.charAt(floor.length - 2);
      const floor_number = floor.charAt(floor.length - 1);
      switch (floor_type) {
        case "m":
          requested_floor = dungeons.catacombs?.MASTER_MODE_FLOORS?.[`floor_${floor_number}`] ?? null;
          break;
        case "f":
          requested_floor = dungeons.catacombs?.floors?.[`floor_${floor_number}`] ?? null;
          break;
        case "e":
          requested_floor = dungeons.catacombs?.floors?.entrance ?? null;
          break;
        default:
          this.send("/gc Invalid Usage: !pb [user] [floor (m7/f4/etc)] [rank (S+, S, any)]");
          break;
      }
      // eslint-disable-next-line no-throw-literal
      if (requested_floor === null) throw `${username} has never gotten a ${rank} on ${floor} before.`;

      switch (rank) {
        case "s+":
          time = requested_floor.fastest_s_plus;
          break;
        case "s":
          time = requested_floor.fastest_s;
          break;
        default:
          this.send("/gc Invalid Usage: !pb [user] [floor (m7/f4/etc)] [rank (S+, S, any)]");
          break;
      }

      if (time === 0) {
        this.send(`/gc ${username} has no PB on ${floor} ${rank}`);
      } else {
        this.send(`/gc ${username}'s PB on ${floor} with ${rank} rank is ${millisToMinutesAndSeconds(time)}`);
      }
    } catch (error) {
      console.log(error);
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
