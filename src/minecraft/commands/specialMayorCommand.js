const minecraftCommand = require("../../contracts/minecraftCommand.js");

/*
Derpy = 368 mod 24 = 8
Jerry = 376 mod 24 = 16
Scorpius = 384 mod 24 = 0
https://hypixel-skyblock.fandom.com/wiki/Mayor_Election#Special_Candidates_Election_Cycle
*/

const hourMs = 50000;
const dayMs = 24 * hourMs;
const monthLength = 31;
const yearLength = 12;

const monthMs = monthLength * dayMs;
const yearMs = yearLength * monthMs;

const yearZero = 1560275700000;

const currentSkyblockYear = timeToSkyblockYear(Date.now());

var yearsUntilSpecial = 0;
var diffSkyblockYear = currentSkyblockYear;
var specialMayor = "";

function timeToSkyblockYear(time) {
  return Math.floor((time - yearZero) / yearMs) + 1;
}

function getSpecialMayor(skyblockYear) {
  if (diffSkyblockYear % 24 == 8) {
    specialMayor = "Derpy";
  } else if (diffSkyblockYear % 24 == 16) {
    specialMayor = "Jerry";
  } else if (diffSkyblockYear % 24 == 0) {
    specialMayor = "Scorpius";
  } else {
    specialMayor = "Error!";
  }
  return specialMayor;
}

class SpecialMayorCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "specialmayor";
    this.aliases = ["specmayor"];
    this.description = "How many years until next special mayor, along with speculated special mayor.";
    this.options = [];
  }

  async onCommand() {
    try {
      if (currentSkyblockYear % 8 == 0) {
        specialMayor = getSpecialMayor(currentSkyblockYear);
        this.send(`Special Mayor this year! It is speculated to be ${specialMayor}.`);
      } else {
        while (diffSkyblockYear % 8 != 0) {
          yearsUntilSpecial += 1;
          diffSkyblockYear += 1;
          specialMayor = getSpecialMayor(diffSkyblockYear);
        }
        this.send(
          `Not Special Mayor, ${yearsUntilSpecial} years until the next one! It is speculated to be ${specialMayor}.`
        );
      }
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

module.exports = SpecialMayorCommand;
