// CREDIT: https://github.com/SkyCryptWebsite/SkyCrypt/ (Modified)
const { titleCase, capitalize, renderLore, formatNumber } = require('../constants/functions')
const { pet_skins } = require('../constants/skins')
const constants = require('../constants/pets')


const rarities = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "mythic",
    "divine",
    "supreme",
    "special",
    "very_special",
  ];

async function getPets(profile) {
    let output = [];

    if (!("pets" in profile)) return output;
  
    for (const pet of profile.pets) {
      if (!("tier" in pet)) {
        continue;
      }

      const petData = constants.pet_data[pet.type] || {
        head: "/head/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40",
        type: "???",
        maxTier: "LEGENDARY",
        maxLevel: 100,
      };
  
      petData.typeGroup = petData.typeGroup ?? pet.type;
  
      pet.rarity = pet.tier.toLowerCase();
      pet.stats = {};
      pet.ignoresTierBoost = petData.ignoresTierBoost;
      const lore = [];
      const petName =
        petData.hatching?.level > pet.level
          ? petData.hatching.name
          : petData.name
          ? petData.name[pet.rarity] ?? petData.name.default
          : titleCase(pet.type.replaceAll("_", " "));
  
      // Rarity upgrades
      if (pet.heldItem == "PET_ITEM_TIER_BOOST" && !pet.ignoresTierBoost) {
        pet.rarity =
          rarities[
            Math.min(rarities.indexOf(petData.maxTier), rarities.indexOf(pet.rarity) + 1)
          ];
      }
  
      if (pet.heldItem == "PET_ITEM_VAMPIRE_FANG" || pet.heldItem == "PET_ITEM_TOY_JERRY") {
        if (rarities.indexOf(pet.rarity) === rarities.indexOf(petData.maxTier) - 1) {
          pet.rarity = petData.maxTier;
        }
      }

      // Get texture
      if (typeof petData.head === "object") {
        pet.texture_path = petData.head[pet.rarity] ?? petData.head.default;
      } else {
        pet.texture_path = petData.head;
      }
  
      if (petData.hatching?.level > pet.level) {
        pet.texture_path = petData.hatching.head;
      }
  
      let petSkin = null;
      if (pet.skin && pet_skins?.[`PET_SKIN_${pet.skin}`]) {
        pet.texture_path = pet_skins[`PET_SKIN_${pet.skin}`].texture;
        petSkin = pet_skins[`PET_SKIN_${pet.skin}`].name;
      }
      const levelData = getPetLevel(pet.exp, petData.customLevelExpRarityOffset ?? pet.rarity, petData.maxLevel);

      pet.name = `[Lvl ${levelData[0]}] ${petName}${petSkin ? ' ✦' : ''}`

      pet.display_name = `${petName}${petSkin ? " ✦" : ""}`;
  
      
      pet.xpMaxLevel = levelData[4]
      pet.level = levelData[0]
      pet.xpCurrent = levelData[1]
      pet.xpForNext = levelData[2]
      pet.progress =  levelData[3]

  
      // Get first row of lore
      const loreFirstRow = ["§8"];
  
      if (petData.type === "all") {
        loreFirstRow.push("All Skills");
      } else {
        loreFirstRow.push(capitalize(petData.type), " ", petData.category ?? "Pet");
  
        if (petData.obtainsExp === "feed") {
          loreFirstRow.push(", feed to gain XP");
        }
  
        if (petSkin) {
          loreFirstRow.push(`, ${petSkin} Skin`);
        }
      }
  
      lore.push(loreFirstRow.join(""), "");
  
      const rarity = rarities.indexOf(pet.rarity);

  
      const searchName = pet.type in constants.petStats ? pet.type : "???";
      const petInstance = new constants.petStats[searchName](rarity, pet.level, pet.extra);
      pet.stats = Object.assign({}, petInstance.stats);
      pet.ref = petInstance;


      
      if (pet.heldItem) {
        const { heldItem } = pet;
        let heldItemObj = await constants.pet_items[heldItem]
  
        if (heldItem in constants.pet_items) {
          for (const stat in constants.pet_items[heldItem]?.stats) {
            pet.stats[stat] = (pet.stats[stat] || 0) + constants.pet_items[heldItem].stats[stat];
          }
          for (const stat in constants.pet_items[heldItem]?.statsPerLevel) {
            pet.stats[stat] =
              (pet.stats[stat] || 0) + constants.pet_items[heldItem].statsPerLevel[stat] * pet.level;
          }
          for (const stat in constants.pet_items[heldItem]?.multStats) {
            if (pet.stats[stat]) {
              pet.stats[stat] = (pet.stats[stat] || 0) * constants.pet_items[heldItem].multStats[stat];
            }
          }
          if ("multAllStats" in constants.pet_items[heldItem]) {
            for (const stat in pet.stats) {
              pet.stats[stat] *= constants.pet_items[heldItem].multAllStats;
            }
          }
        }
  
        // push pet lore after held item stats added
        const stats = pet.ref.lore(pet.stats);
        stats.forEach((line) => {
          lore.push(line);
        });
  
        // then the ability lore
        const abilities = pet.ref.abilities;
        abilities.forEach((ability) => {
          lore.push(" ", ability.name);
          ability.desc.forEach((line) => {
            lore.push(line);
          });
        });
  
        // now we push the lore of the held items
        if (!heldItemObj) {
          heldItemObj = constants.pet_items[heldItem];
        }
        lore.push("", `§6Held Item: §${constants.rarityColors[heldItemObj.tier.toLowerCase()]}${heldItemObj.name}`);
  
        if (heldItem in constants.pet_items) {
          lore.push(constants.pet_items[heldItem].description);
        }
        // extra line
        lore.push(" ");
      } else {
        // no held items so push the new stats
        const stats = pet.ref.lore();
        stats.forEach((line) => {
          lore.push(line);
        });
  
        const abilities = pet.ref.abilities;
        abilities.forEach((ability) => {
          lore.push(" ", ability.name);
          ability.desc.forEach((line) => {
            lore.push(line);
          });
        });
  
        // extra line
        lore.push(" ");
      }
  
      // passive perks text
      if (petData.passivePerks) {
        lore.push("§8This pet's perks are active even when the pet is not summoned!", "");
      }
  
      // always gains exp text
      if (petData.alwaysGainsExp) {
        lore.push("§8This pet gains XP even when not summoned!", "");
  
        if (typeof petData.alwaysGainsExp === "string") {
          lore.push(`§8This pet only gains XP on the ${petData.alwaysGainsExp}§8!`, "");
        }
      }
  
      if (pet.level < petData.maxLevel) {
        lore.push(`§7Progress to Level ${pet.level + 1}: §e${(pet.progress * 100).toFixed(1)}%`);
  
        const progress = Math.ceil(pet.progress * 20);
        const numerator = pet.xpCurrent.toLocaleString();
        const denominator = formatNumber(pet.xpForNext, false, 10);
  
        lore.push(`§2${"-".repeat(progress)}§f${"-".repeat(20 - progress)} §e${numerator} §6/ §e${denominator}`);
      } else {
        lore.push("§bMAX LEVEL");
      }
  
      lore.push(
        "",
        `§7Total XP: §e${formatNumber(pet.exp, true, 10)} §6/ §e${formatNumber(
          pet.xpMaxLevel,
          true,
          10
        )} §6(${Math.floor((pet.exp / pet.xpMaxLevel) * 100)}%)`
      );
  
      if (petData.obtainsExp !== "feed") {
        lore.push(`§7Candy Used: §e${pet.candyUsed || 0} §6/ §e10`);
      }
  
      pet.lore = "";

      // pet.ref = null
      delete(pet.ref)
      delete(pet.uuid)
  
      // eslint-disable-next-line no-unused-vars
      for (const [index, line] of lore.entries()) {
        pet.lore += '' + renderLore(line) + "\n";
      }
      pet.lore = pet.lore.split('\n')
  
      output.push(pet);
    }
  
    output = output.sort((a, b) => {
      if (a.active === b.active) {
        if (a.rarity == b.rarity) {
          if (a.type == b.type) {
            return a.level.level > b.level.level ? -1 : 1;
          } else {
            let maxPetA = output
              .filter((x) => x.type == a.type && x.rarity == a.rarity)
              .sort((x, y) => y.level.level - x.level.level);
  
            maxPetA = maxPetA.length > 0 ? maxPetA[0].level.level : null;
  
            let maxPetB = output
              .filter((x) => x.type == b.type && x.rarity == b.rarity)
              .sort((x, y) => y.level.level - x.level.level);
  
            maxPetB = maxPetB.length > 0 ? maxPetB[0].level.level : null;
  
            if (maxPetA && maxPetB && maxPetA == maxPetB) {
              return a.type < b.type ? -1 : 1;
            } else {
              return maxPetA > maxPetB ? -1 : 1;
            }
          }
        } else {
          return rarities.indexOf(a.rarity) < rarities.indexOf(b.rarity) ? 1 : -1;
        }
      }
  
      return a.active ? -1 : 1;
    });

    return output;
}



function getPetLevel(petExp, offsetRarity, maxLevel) {
    const rarityOffset = constants.pet_rarity_offset[offsetRarity];
    const levels = constants.pet_levels.slice(rarityOffset, rarityOffset + maxLevel - 1);
  
    const xpMaxLevel = levels.reduce((a, b) => a + b, 0);
    let xpTotal = 0;
    let level = 1;
  
    let xpForNext = Infinity;
  
    for (let i = 0; i < maxLevel; i++) {
      xpTotal += levels[i];
  
      if (xpTotal > petExp) {
        xpTotal -= levels[i];
        break;
      } else {
        level++;
      }
    }
  
    let xpCurrent = Math.floor(petExp - xpTotal);
    let progress;
  
    if (level < maxLevel) {
      xpForNext = Math.ceil(levels[level - 1]);
      progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
    } else {
      level = maxLevel;
      xpCurrent = petExp - levels[maxLevel - 1];
      xpForNext = 0;
      progress = 0;
    }
  
    return [ level, xpCurrent, xpForNext, progress, xpMaxLevel ]
    
  }
  
  async function getBackpackContents(arraybuf) {
    const buf = Buffer.from(arraybuf);
  
    let data = await parseNbt(buf);
    data = nbt.simplify(data);
  
    const items = data.i;
  
    for (const [index, item] of items.entries()) {
      item.isInactive = true;
      item.inBackpack = true;
      item.item_index = index;
    }
  
    return items;
}

module.exports = { getPets }
/*
module.exports = (profile) => {
    const pets = profile?.pets
    if (pets) {
        const all_pets = []
        for (let pet of pets) {
            all_pets.push(getPet(pet))
        }
        return all_pets        
    } else {
        return []
    }
}

function getPet(pet) {
    let rarity = pet.tier.toLowerCase()
    let pet_rarity_offset = { common: 0, uncommon: 6, rare: 11, epic: 16, legendary: 20, mythic: 20 }
    const rarityOffset = pet_rarity_offset[rarity]
    const levels = xp_tables.pets.slice(rarityOffset, rarityOffset + 99)

    let xpTotal = 0
    let level = 1
    let xpForNext = Infinity
    let maxLevel = 100
    if (pet.type === 'GOLDEN_DRAGON') maxLevel = 200

    for (let i = 0; i < maxLevel; i++) {
        xpTotal += levels[i];
        if (xpTotal > pet.exp) {
            xpTotal -= levels[i];
            break;
        } else {
            level++;
        }
    }
    let xpCurrent = Math.floor(pet.exp - xpTotal)
    let progress

    if (level < maxLevel) {
        xpForNext = Math.ceil(levels[level - 1]);
        progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
    } else {
        level = maxLevel;
        xpCurrent = pet.exp - levels[98];
        xpForNext = 0;
        progress = 1;
    }
    let name = `[Lvl ${level}] ${titleCase(pet.type.replace(/_/g, ' '))}${pet.skin ? ' ✦' : ''}`
    return { name, level, xpCurrent, xpForNext, progress, tier: pet.tier, type: pet.type, exp: pet.exp, skin: pet.skin }
}*/