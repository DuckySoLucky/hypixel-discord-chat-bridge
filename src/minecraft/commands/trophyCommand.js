const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class AccessoriesCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "trophyfish";
    this.aliases = ["trophy", "fish"];
    this.description = "Shows the trophy fishing stats.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "advanced",
        description: "Must be + in order to show detailed data about player",
        required: false,
      },
    ];
  }

  prepareData(tfd, type, extended = false) {
    let bronze = tfd?.[`${type}_bronze`] || 0;
    let silver = tfd?.[`${type}_silver`] || 0;
    let gold = tfd?.[`${type}_gold`] || 0;
    let diamond = tfd?.[`${type}_diamond`] || 0;

    let type_caught = tfd?.[type];

    let bronze_status = "-";
    let silver_status = "-";
    let gold_status = "-";
    let diamond_status = "-";

    let overall_status = "-";

    if (bronze >= 1) {
      bronze_status = "B";
      overall_status = "B";
    }
    if (silver >= 1) {
      silver_status = "S";
      overall_status = "S";
    }
    if (gold >= 1) {
      gold_status = "G";
      overall_status = "G";
    }
    if (diamond >= 1) {
      diamond_status = "D";
      overall_status = "D";
    }

    if (extended) {
      return [`(${bronze_status}${silver_status}${gold_status}${diamond_status} ${type_caught})`, Math.min(diamond, 1)];
    }

    return [`${overall_status}`, Math.min(diamond, 1)];
  }

  async onCommand(username, message, channel = "gc") {
    try {
      if (this.getArgs(message)[0] != "+") {
        username = this.getArgs(message)[0] || username;
      }

      let extended = false;
      if (this.getArgs(message)[0] == "+" || this.getArgs(message)[1] == "+") {
        extended = true;
      }

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      let tfd = data?.profile?.trophy_fish;
      if (tfd == undefined) {
        throw "Player hasn't fished any trophy fish.";
      }

      let rewards = ["None", "Bronze", "Silver", "Gold", "Diamond"];

      let claimed_rewards = rewards[tfd.rewards.length];
      let total_fishes = tfd.total_caught || 0;

      let [blob, bld] = this.prepareData(tfd, "blobfish", extended);
      let [gusher, gsd] = this.prepareData(tfd, "gusher", extended);
      let [obf1, o1d] = this.prepareData(tfd, "obfuscated_fish_1", extended);
      let [skitter, skd] = this.prepareData(tfd, "sulphur_skitter", extended);
      let [flounder, fld] = this.prepareData(tfd, "steaming_hot_flounder", extended);

      let [fly, ffd] = this.prepareData(tfd, "flyfish", extended);
      let [slug, sld] = this.prepareData(tfd, "slugfish", extended);
      let [obf2, o2d] = this.prepareData(tfd, "obfuscated_fish_2", extended);

      let [horse, hrd] = this.prepareData(tfd, "lava_horse", extended);
      let [mana_ray, mrd] = this.prepareData(tfd, "mana_ray", extended);
      let [obf3, o3d] = this.prepareData(tfd, "obfuscated_fish_3", extended);
      let [stone, std] = this.prepareData(tfd, "volcanic_stonefish", extended);
      let [vanille, vad] = this.prepareData(tfd, "vanille", extended);

      let [soul, sod] = this.prepareData(tfd, "soul_fish", extended);
      let [karate, krd] = this.prepareData(tfd, "karate_fish", extended);
      let [skeleton, sfd] = this.prepareData(tfd, "skeleton_fish", extended);
      let [moldfin, mfd] = this.prepareData(tfd, "moldfin", extended);

      let [golden, gfd] = this.prepareData(tfd, "golden_fish", extended);

      let diamonds = bld + gsd + o1d + skd + fld + ffd + sld + o2d;
      diamonds += hrd + mrd + o3d + std + vad + sod + krd + sfd + mfd + gfd;

      if (extended) {
        let info1 = `[${username}] ${claimed_rewards} (${diamonds}/18) | Total: ${total_fishes} | Blob ${blob} Gusher ${gusher} Obf 1 ${obf1} Skitter ${skitter} Flounder ${flounder} | Fly ${fly} Slug ${slug} Obf 2 ${obf2}`;

        let info2 = `Horse ${horse} Mana Ray ${mana_ray} Obf 3 ${obf3} Stone ${stone} Vanille ${vanille} | Soul ${soul} Karate ${karate} Skeleton ${skeleton} Moldfin ${moldfin} | Golden ${golden}`;

        this.send(`/${channel} ${info1}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.send(`/${channel} ${info2}`);
      } else {
        let info = `${username}: (${diamonds}/18) | Blob ${blob}, Gusher ${gusher}, Obf 1 ${obf1}, Skitter ${skitter}, Flounder ${flounder} | Fly ${fly}, Slug ${slug}, Obf 2 ${obf2} | Horse ${horse}, Mana Ray ${mana_ray}, Obf 3 ${obf3}, Stone ${stone}, Vanille ${vanille} | Soul ${soul}, Karate ${karate}, Skeleton ${skeleton}, Moldfin ${moldfin} | Golden ${golden}`;

        this.send(`/${channel} ${info}`);
      }
    } catch (error) {
      this.send(`/${channel} Error: ${error}`);
    }
  }
}

module.exports = AccessoriesCommand;
