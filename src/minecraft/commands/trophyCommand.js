const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { renderLore } = require("../../contracts/renderItem.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");

class TrophyFishCommand extends minecraftCommand {
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
    ];
  }

  prepareData(tfd, type) {
    let bronze = tfd?.[`${type}_bronze`] ?? 0;
    let silver = tfd?.[`${type}_silver`] ?? 0;
    let gold = tfd?.[`${type}_gold`] ?? 0;
    let diamond = tfd?.[`${type}_diamond`] ?? 0;

    let type_caught = tfd?.[type];

    return {
      caught: type_caught ?? 0,
      catches: {
        bronze: bronze,
        silver: silver,
        gold: gold,
        diamond: diamond,
      },
      uniques: {
        bronze: Math.min(bronze, 1),
        silver: Math.min(silver, 1),
        gold: Math.min(gold, 1),
        diamond: Math.min(diamond, 1),
      },
    };
  }

  async onCommand(username, message, channel = "gc") {
    try {
      if (this.getArgs(message)[0] != "+") {
        username = this.getArgs(message)[0] || username;
      }

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      let tfd = data?.profile?.trophy_fish;
      if (tfd == undefined) {
        throw "Player hasn't fished any trophy fish.";
      }

      let rarity = {
        COMMON: "§f",
        UNCOMMON: "§a",
        RARE: "§9",
        EPIC: "§5",
        LEGENDARY: "§6",
      };

      let fishes = {
        // COMMON
        blobfish: {
          name: "Blobfish",
          rarity: "COMMON",
        },
        gusher: {
          name: "Gusher",
          rarity: "COMMON",
        },
        obfuscated_fish_1: {
          name: "Obfuscated 1",
          rarity: "COMMON",
        },
        sulphur_skitter: {
          name: "Sulphur Skitter",
          rarity: "COMMON",
        },
        steaming_hot_flounder: {
          name: "Steaming-Hot Flounder",
          rarity: "COMMON",
        },

        // UNCOMMON
        flyfish: {
          name: "Flyfish",
          rarity: "UNCOMMON",
        },
        slugfish: {
          name: "Slugfish",
          rarity: "UNCOMMON",
        },
        obfuscated_fish_2: {
          name: "Obfuscated 2",
          rarity: "UNCOMMON",
        },

        // RARE
        lava_horse: {
          name: "Lavahorse",
          rarity: "RARE",
        },
        mana_ray: {
          name: "Mana Ray",
          rarity: "RARE",
        },
        obfuscated_fish_3: {
          name: "Obfuscated 3",
          rarity: "RARE",
        },
        volcanic_stonefish: {
          name: "Volcanic Stonefish",
          rarity: "RARE",
        },
        vanille: {
          name: "Vanille",
          rarity: "RARE",
        },

        // EPIC
        soul_fish: {
          name: "Soul Fish",
          rarity: "EPIC",
        },
        karate_fish: {
          name: "Karate Fish",
          rarity: "EPIC",
        },
        skeleton_fish: {
          name: "Skeleton Fish",
          rarity: "EPIC",
        },
        moldfin: {
          name: "Moldfin",
          rarity: "EPIC",
        },

        // LEGENDARY
        golden_fish: {
          name: "Golden Fish",
          rarity: "LEGENDARY",
        },
      };

      let total_fishes = tfd.total_caught || 0;

      let bronzes = 0;
      let silvers = 0;
      let golds = 0;
      let diamonds = 0;

      let Name = `§6${username}'s Trophy Fish:`;
      let Lore = [];

      Object.entries(fishes).forEach((element) => {
        let fish_id = element[0];
        let fish_display = element[1];

        let data = this.prepareData(tfd, fish_id);

        bronzes += Math.max(data.uniques.bronze, data.uniques.silver, data.uniques.gold, data.uniques.diamond);

        silvers += Math.max(data.uniques.silver, data.uniques.gold, data.uniques.diamond);

        golds += Math.max(data.uniques.gold, data.uniques.diamond);

        diamonds += data.uniques.diamond;

        let correct_display_name = (rarity?.[fish_display.rarity] ?? "§r") + fish_display.name;

        let display_bronzes = data.catches.bronze > 0 ? `§8${data.catches.bronze}` : "§c✖";
        let display_silvers = data.catches.silver > 0 ? `§7${data.catches.silver}` : "§c✖";
        let display_golds = data.catches.gold > 0 ? `§6${data.catches.gold}` : "§c✖";
        let display_diamonds = data.catches.diamond > 0 ? `§b${data.catches.diamond}` : "§c✖";

        Lore.push(
          `${correct_display_name}§7: ${display_bronzes} §7| ${display_silvers} §7| ${display_golds} §7| ${display_diamonds} §7(${data.caught})§f`
        );
      });

      Lore.unshift(`§f`);

      let total_bronzes = bronzes == 18 ? `§a✔§7 (§a18§7/18)` : `§c✖ §7(§c${bronzes}§7/18)`;
      let total_silvers = silvers == 18 ? `§a✔§7 (§a18§7/18)` : `§c✖ §7(§c${silvers}§7/18)`;
      let total_golds = golds == 18 ? `§a✔§7 (§a18§7/18)` : `§c✖ §7(§c${golds}§7/18)`;
      let total_diamonds = diamonds == 18 ? `§a✔§7 (§a18§7/18)` : `§c✖ §7(§c${diamonds}§7/18)`;

      Lore.unshift(`§b§lDIAMOND: ${total_diamonds}§f`);
      Lore.unshift(`§6§lGOLD: ${total_golds}§f`);
      Lore.unshift(`§7§lSILVER: ${total_silvers}§f`);
      Lore.unshift(`§8§lBRONZE: ${total_bronzes}§f`);

      Lore.unshift(`§f`);
      Lore.unshift(`§7Total Catches: ${total_fishes}§f`);

      Lore.push("§f");

      const renderedItem = await renderLore(Name, Lore);

      const upload = await uploadImage(renderedItem);

      this.send(`/${channel} ${username}'s Trophy Fish stats: ${upload.data.link}`);
    } catch (error) {
      console.log(error);
      this.send(`/${channel} [ERROR] ${error}`);
    }
  }
}

module.exports = TrophyFishCommand;
