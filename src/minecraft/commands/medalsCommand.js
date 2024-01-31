const minecraftCommand = require("../../contracts/minecraftCommand.js");
const getTalismans = require("../../../API/stats/talismans.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { renderLore } = require("../../contracts/renderItem.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");

class MedalsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "medals";
    this.aliases = ["jacob", "jacobs", "farming"];
    this.description = "Shows player's Jacob's Contest stats.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  getCropMedals(crop_id, crop_name, unique_brackets, personal_bests){
    let color = "§8";
    let brackets = "§c○§f○§6○§3○§b○";
    let personal_best = "N/A";
    let gold = 0;

    let bronzes = unique_brackets?.bronze ?? [];
    let silvers = unique_brackets?.silver ?? [];
    let golds = unique_brackets?.gold ?? [];
    let platinums = unique_brackets?.platinum ?? [];
    let diamonds = unique_brackets?.diamond ?? [];

    // BRONZE BRACKET CHECK
    if(bronzes.includes(crop_id)){
      color = "§c";
      brackets = "§c●§f○§6○§3○§b○";
    }

    // SILVER BRACKET CHECK
    if(silvers.includes(crop_id)){
      color = "§f";
      brackets = "§c●§f●§6○§3○§b○";
    }

    // GOLD BRACKET CHECK
    if(golds.includes(crop_id)){
      color = "§6";
      brackets = "§c●§f●§6●§3○§b○";
      gold = 1;
    }

    // PLATINUM BRACKET CHECK
    if(platinums.includes(crop_id)){
      color = "§3";
      brackets = "§c●§f●§6●§3●§b○";
      gold = 1;
    }

    // DIAMOND BRACKET CHECK
    if(diamonds.includes(crop_id)){
      color = "§b";
      brackets = "§c●§f●§6●§3●§b●";
      gold = 1;
    }

    personal_best = personal_bests?.[crop_id] ?? "N/A";

    let response = {
      display: `§7${color}${crop_name}§7: ${brackets} §7(Best: ${personal_best})§7`,
      gold: gold
    };
    return response;
  }

  async onCommand(username, message, channel = "gc") {
    try {
      if (this.getArgs(message)[0] != "+") {
        username = this.getArgs(message)[0] || username;
      }

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      let jacob_data = data?.profile?.jacob2;
      if (jacob_data == undefined) {
        throw "Player hasn't participated in any Jacob's Contests.";
      }

      let Name = `§6${username}'s Jacob's Contests:`;
      let Lore = [];

      let medals_inv = jacob_data?.medals_inv ?? {};
      let unique_brackets = jacob_data?.unique_brackets ?? {};
      let contests = jacob_data?.contests ?? {};
      let personal_bests = jacob_data?.personal_bests ?? {};
      let golds = 0;

      console.log(medals_inv, unique_brackets, Object.entries(contests).length, personal_bests);

      let crops = {
        'WHEAT': "Wheat",
        'CARROT_ITEM': "Carrot",
        'POTATO_ITEM': "Potato",
        'PUMPKIN': "Pumpkin",
        'MELON': "Melon",
        'MUSHROOM_COLLECTION': "Mushroom",
        'CACTUS': "Cactus",
        'SUGAR_CANE': "Sugar Cane",
        'NETHER_STALK': "Nether Wart",
        'INK_SACK:3': "Cocoa Beans",
      };

      Object.entries(crops).forEach((element) => {
        let crop_id = element[0];
        let crop_name = element[1];

        let crop_data = this.getCropMedals(crop_id, crop_name, unique_brackets, personal_bests);
        golds += crop_data.gold;

        Lore.push(crop_data.display);
      });

      Lore.push(`§f`);

      Lore.unshift(`§f`);
      Lore.unshift(`§7Medals inventory: §c${medals_inv.bronze ?? 0}§7 | §f${medals_inv.silver ?? 0}§7 | §6${medals_inv.gold ?? 0}§7.`);
      Lore.unshift(`§f`);
      Lore.unshift(`§7Unique golds: §6${golds}§7/10.`);
      Lore.unshift(`§7Participated in §6${Object.entries(contests).length}§7 contests.`);
      Lore.unshift(`§f`);
      
      const renderedItem = await renderLore(Name, Lore);
      const upload = await uploadImage(renderedItem);
      this.send(`/${channel} ${username}'s Jacobs Contest stats: ${upload.data.link}.`);
    } catch (error) {
      console.log(error);
      this.send(`/${channel} [ERROR] ${error}`);
    }
  }
}

module.exports = MedalsCommand;
