// CREDIT: https://github.com/SkyCryptWebsite/SkyCrypt/ (Modified)

const { floor, round } = require('./functions')
const { symbols } = require('./symbols')

function formatStat(stat) {
  const statFloored = Math.floor(stat);
  if (statFloored > 0) {
    return `§a+${statFloored}`;
  } else {
    return `§a${statFloored}`;
  }
}

function getValue(rarity, data) {
  const base = Object.values(data)[0];
  const common = data.common ?? base;
  const uncommon = data.uncommon ?? common;
  const rare = data.rare ?? uncommon;
  const epic = data.epic ?? rare;
  const legendary = data.legendary ?? epic;
  const mythic = data.mythic ?? legendary;

  switch (rarity) {
    case COMMON:
      return common;
    case UNCOMMON:
      return uncommon;
    case RARE:
      return rare;
    case EPIC:
      return epic;
    case LEGENDARY:
      return legendary;
    case MYTHIC:
      return mythic;
    default:
      throw new Error("Unknown rarity");
  }
}
  
class Pet {
  constructor(rarity, level, extra) {
    this.rarity = rarity;
    this.level = level;
    this.extra = extra;
  }

  lore(newStats = false) {
    if (!newStats) {
      newStats = this.stats;
    }
    const list = [];
    for (const stat in newStats) {
      switch (stat) {
        case "health":
          list.push(`§7Health: ${formatStat(newStats[stat])}`);
          break;
        case "defense":
          list.push(`§7Defense: ${formatStat(newStats[stat])}`);
          break;
        case "strength":
          list.push(`§7Strength: ${formatStat(newStats[stat])}`);
          break;
        case "crit_chance":
          list.push(`§7Crit Chance: ${formatStat(newStats[stat])}`);
          break;
        case "crit_damage":
          list.push(`§7Crit Damage: ${formatStat(newStats[stat])}`);
          break;
        case "intelligence":
          list.push(`§7Intelligence: ${formatStat(newStats[stat])}`);
          break;
        case "speed":
          list.push(`§7Speed: ${formatStat(newStats[stat])}`);
          break;
        case "bonus_attack_speed":
          list.push(`§7Bonus Attack Speed: ${formatStat(newStats[stat])}`);
          break;
        case "sea_creature_chance":
          list.push(`§7Sea Creature Chance: ${formatStat(newStats[stat])}%`);
          break;
        case "magic_find":
          list.push(`§7Magic Find: ${formatStat(newStats[stat])}`);
          break;
        case "pet_luck":
          list.push(`§7Pet Luck: ${formatStat(newStats[stat])}`);
          break;
        case "true_defense":
          list.push(`§7True Defense: ${formatStat(newStats[stat])}`);
          break;
        case "ability_damage":
          list.push(`§7Ability Damage: ${formatStat(newStats[stat])}%`);
          break;
        case "damage":
          list.push(`§7Damage: ${formatStat(newStats[stat])}`);
          break;
        case "ferocity":
          list.push(`§7Ferocity: ${formatStat(newStats[stat])}`);
          break;
        case "mining_speed":
          list.push(`§7Mining Speed: ${formatStat(newStats[stat])}`);
          break;
        case "mining_fortune":
          list.push(`§7Mining Fortune: ${formatStat(newStats[stat])}`);
          break;
        case "farming_fortune":
          list.push(`§7Farming Fortune: ${formatStat(newStats[stat])}`);
          break;
        default:
          list.push(`§cUNKNOWN: ${stat}`);
          break;
      }
    }
    return list;
  }
}

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


const rarityColors = {
  common: "f",
  uncommon: "a",
  rare: "9",
  epic: "5",
  legendary: "6",
  mythic: "d",
  divine: "b",
  supreme: "4",
  special: "c",
  very_special: "c",
};

class Bee extends Pet {
  get stats() {
    return {
      strength: 5 + this.level * 0.25,
      intelligence: this.level * 0.5,
      speed: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const intMult = getValue(this.rarity, { common: 0.02, uncommon: 0.04, rare: 0.09, epic: 0.14, legendary: 0.19 });
    const strMult = getValue(this.rarity, { common: 0.02, uncommon: 0.04, rare: 0.07, epic: 0.11, legendary: 0.14 });

    return {
      name: "§6Hive",
      desc: [
        `§7Gain §b+${round(this.level * intMult + 1, 1)} ${symbols.intelligence.symbol} Intelligence §7and §c+${round(
          this.level * strMult + 1,
          1
        )} ${symbols.strength.symbol} Strength §7for each nearby bee.`,
        `§8Max 15 bees`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.5, epic: 1 });
    return {
      name: "§6Busy Buzz Buzz",
      desc: [`§7Has §a${round(this.level * mult, 1)}% §7chance for flowers to drop an extra one`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.2 });
    return {
      name: "§6Weaponized Honey",
      desc: [`§7Gain §a${round(5 + this.level * mult, 1)}% §7of received damage as §6${symbols.health.symbol} Absorption`],
    };
  }
}

class Chicken extends Pet {
  get stats() {
    return {
      health: this.level * 2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.3, uncommon: 0.4, epic: 0.5 });
    return {
      name: "§6Light Feet",
      desc: [`§7Reduces fall damage by §a${round(this.level * mult, 1)}%`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.8, epic: 1 });
    return {
      name: "§6Eggstra",
      desc: [`§7Killing chickens has a §a${round(this.level * mult, 1)}% §7chance to drop an egg`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Mighty Chickens",
      desc: [`§7Chicken minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }
}

class Elephant extends Pet {
  get stats() {
    return {
      intelligence: this.level * 0.75,
      health: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.15, epic: 0.2 });
    return {
      name: "§6Stomp",
      desc: [
        `§7Gain §a${round(this.level * mult, 1)} ${symbols.defense.symbol} Defense §7for every §f100 ${symbols.speed.symbol} Speed`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.01 });
    return {
      name: "§6Walking Fortress",
      desc: [
        `§7Gain §c${round(this.level * mult, 1)} ${symbols.health.symbol} Health §7for every §a10 ${symbols.defense.symbol} Defense`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 1.8 });
    return {
      name: "§6Trunk Efficiency",
      desc: [
        `§7Grants §a+${round(this.level * mult, 1)} §6${
          symbols.farming_fortune.symbol
        } Farming Fortune§7, which increases your chance for multiple drops`,
      ],
    };
  }
}

class Pig extends Pet {
  get stats() {
    return {
      speed: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= RARE) {
      list.push(this.third);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Ridable",
      desc: [`§7Right-click your summoned pet to ride it!`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { common: 0.3, uncommon: 0.4, epic: 0.5 });
    return {
      name: "§6Run",
      desc: [`§7Increases the speed of your mount by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { rare: 0.4, epic: 0.5 });
    return {
      name: "§6Sprint",
      desc: [
        `§7While holding an Enchanted Carrot on a Stick, increase the speed of your mount by §a${round(
          this.level * mult,
          1
        )}%`,
      ],
    };
  }

  get fourth() {
    return {
      name: "§6Trample",
      desc: [`§7While on your private island, break all crops your pig rides over`],
    };
  }
}

class Rabbit extends Pet {
  get stats() {
    return {
      health: this.level * 1,
      speed: this.level * 0.2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.3, uncommon: 0.4, epic: 0.5 });
    return {
      name: "§6Happy Feet ",
      desc: [`§7Jump Potions also give §a+${round(this.level * mult, 0)} §7speed`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.25, epic: 0.3 });
    return {
      name: "§6Farming Exp Boost ",
      desc: [`§7Boosts your Farming Exp by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Efficient Farming",
      desc: [`§7Farming minions work §a${round(this.level * mult, 1)}% §7faster while on your island.`],
    };
  }
}

class Armadillo extends Pet {
  get stats() {
    return {
      defense: this.level * 2,
    };
  }

  get abilities() {
    const list = [this.first, this.second, this.third];
    if (this.rarity >= RARE) {
      list.push(this.fourth);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fifth);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Rideable",
      desc: [`§7Right-click on your summoned pet to ride it!`],
    };
  }

  get second() {
    return {
      name: "§6Tunneler",
      desc: [`§7The Armadillo breaks all stone or ore in it's path while you are riding it in the §3Crystal Hollows`],
    };
  }

  get third() {
    return {
      name: "§6Earth Surfer",
      desc: [`§7The Armadillo moves faster based on your §fSpeed`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { rare: 0.2, epic: 0.3 });
    return {
      name: "§6Rolling Miner",
      desc: [`§7Every §a${round(60 - this.level * mult, 1)} §7seconds, the next gemstone you mine gives 2x drops.`],
    };
  }

  get fifth() {
    const mult = getValue(this.rarity, { legendary: 0.5 });
    return {
      name: "§6Mobile Tank",
      desc: [
        `§7For every §a${round(100 - this.level * mult, 1)} §7Defense, gain §f+1 ${symbols.speed.symbol} Speed §7and §6+1 ${
          symbols.mining_speed.symbol
        } Mining Speed`,
      ],
    };
  }
}

class Bat extends Pet {
  get stats() {
    const stats = {
      intelligence: this.level * 1,
      speed: this.level * 0.05,
    };
    if (this.rarity >= MYTHIC) {
      stats.sea_creature_chance = this.level * 0.05;
    }
    return stats;
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    if (this.rarity >= MYTHIC) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.15, epic: 0.2 });
    return {
      name: "§6Candy Lover",
      desc: [`§7Increases the chance for mobs to drop Candy by §a${round(this.level * mult, 1)}%`],
    };
  }

  get second() {
    const mult_intel = getValue(this.rarity, { rare: 0.2, epic: 0.3 });
    const mult_speed = getValue(this.rarity, { rare: 0.4, epic: 0.5 });
    return {
      name: "§6Nightmare",
      desc: [
        `§7During night, gain §a${round(this.level * mult_intel, 1)} §9${symbols.intelligence.symbol} Intelligence, §a${round(
          this.level * mult_speed,
          1
        )} §f${symbols.speed.symbol} Speed§7, and night vision`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.5 });
    return {
      name: "§6Wings of Steel",
      desc: [`§7Deals §a+${round(this.level * mult, 1)}% §7damage to §6Spooky §7enemies during the §6Spooky Festival`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { mythic: 0.25 });
    return {
      name: "§6Sonar",
      desc: [`§7+§a${round(this.level * mult, 1)}% §7chance to fish up spooky sea creatures`],
    };
  }
}

class Endermite extends Pet {
  get stats() {
    return {
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.3, uncommon: 0.4, epic: 0.5 });
    return {
      name: "§6More Stonks",
      desc: [
        `§7Gain more exp orbs for breaking end stone and gain a +§a${round(
          this.level * mult,
          1
        )}% §7chance to get an extra block dropped.`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.03, epic: 0.05 });
    return {
      name: "§6Pearl Muncher",
      desc: [`§7Upon picking up an ender pearl, consume it and gain §a${5 + round(this.level * mult, 1)} §6coins`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.4 });
    return {
      name: "§6Pearl Powered",
      desc: [`§7Upon consuming an ender pearl, gain +§a${10 + round(this.level * mult, 1)} §7speed for 10 seconds`],
    };
  }
}

class MithrilGolem extends Pet {
  get stats() {
    return {
      true_defense: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.5, uncommon: 0.75, epic: 1 });
    return {
      name: "§6Mithril Affinity",
      desc: [`§7Gain +§a${round(this.level * mult, 1)} §6${symbols.mining_speed.symbol} Mining Speed §7when mining §eMithril`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.1, epic: 0.2 });
    return {
      name: "§6The Smell Of Powder",
      desc: [`§7Gain +§a${round(this.level * mult, 1)}% §7more §2Mithril Powder`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.2 });
    return {
      name: "§6Danger Averse",
      desc: [`§7Increases your combat stats by +§a${round(this.level * mult, 1)}% §7on mining islands`],
    };
  }
}

class Rock extends Pet {
  get stats() {
    return {
      defense: this.level * 2,
      true_defense: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= RARE) {
      list.push(this.third);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Ridable",
      desc: [`§7Right-click on your summoned pet to ride it!`],
    };
  }

  get second() {
    return {
      name: "§6Sailing Stone",
      desc: [`§7Sneak to move your rock to your location (15s cooldown)`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { rare: 0.2, epic: 0.25 });
    return {
      name: "§6Fortify",
      desc: [`§7While sitting on your rock, gain +§a${round(this.level * mult, 1)}% §7defense`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Steady Ground",
      desc: [`§7While sitting on your rock, gain +§a${round(this.level * mult, 1)}§7% damage`],
    };
  }
}

class Scatha extends Pet {
  get stats() {
    return {
      defense: this.level * 1,
      mining_speed: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { rare: 1, epic: 1.25 });
    return {
      name: "§6Grounded",
      desc: [`§7Gain §6+${round(this.level * mult - 0.01, 1)}${symbols.mining_fortune.symbol} Mining Fortune§7`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.025, epic: 0.03 });
    return {
      name: "§6Burrowing",
      desc: [`§7Grants a §a+${round(this.level * mult, 1)}% §7chance to find treasure while mining`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 1 });
    return {
      name: "§6Wormhole",
      desc: [`§7Gives a §a${round(this.level * mult, 1)}% §7to mine 2 adjacent stone or hard stone`],
    };
  }
}

class Silverfish extends Pet {
  get stats() {
    return {
      defense: this.level * 1,
      health: this.level * 0.2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.05, uncommon: 0.1, epic: 0.15 });
    return {
      name: "§6True Defense Boost",
      desc: [`§7Boosts your §f${symbols.true_defense.symbol} True Defense §7by §a${floor(this.level * mult, 1)}`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.25, epic: 0.3 });
    return {
      name: "§6Mining Exp Boost",
      desc: [`§7Boosts your Mining exp by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    return {
      name: "§6Dexterity",
      desc: [`§7Gives permanent haste III`],
    };
  }
}

class WitherSkeleton extends Pet {
  get stats() {
    return {
      crit_chance: this.level * 0.05,
      intelligence: this.level * 0.25,
      crit_damage: this.level * 0.25,
      defense: this.level * 0.25,
      strength: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.3 });
    return {
      name: "§6Stronger Bones",
      desc: [`§7Take §a${round(this.level * mult, 1)}% §7less damage from skeletons`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.25 });
    return {
      name: "§6Wither Blood",
      desc: [`§7Deal §a${round(this.level * mult, 1)}% §7more damage to wither mobs`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 2 });
    return {
      name: "§6Death's Touch",
      desc: [
        `§7Upon hitting an enemy inflict the wither effect for §a${round(
          this.level * mult,
          1
        )}% §7damage over 3 seconds`,
        `§8Does not stack`,
      ],
    };
  }
}

class Bal extends Pet {
  get stats() {
    return {
      ferocity: this.level * 0.1,
      strength: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Protective Skin",
      desc: [`§7§7Gives §cheat immunity.`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.1 });
    return {
      name: "§6Fire Whip",
      desc: [
        `§7Every §a5s §7while in combat the Balrog will strike nearby enemies with his fire whip dealing §c${round(
          this.level * mult,
          1
        )}% §7of your damage as §ftrue damage.`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.15 });
    return {
      name: "§6Made of Lava",
      desc: [`§7Gain §a${round(this.level * mult, 1)}% §7on ALL stats when inside the §cMagma Fields.`],
    };
  }
}

class BlackCat extends Pet {
  get stats() {
    return {
      speed: this.level * 0.25,
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { legendary: 1 });
    return {
      name: "§6Hunter",
      desc: [`§7Increases your speed and speed cap by +§a${round(this.level * mult, 1)}`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { legendary: 0.15 });
    return {
      name: "§6Omen",
      desc: [`§7Grants §d${floor(this.level * mult, 1)} ${symbols.pet_luck.symbol} Pet Luck`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.15 });
    return {
      name: "§6Supernatural",
      desc: [`§7Grants §b${floor(this.level * mult, 1)} ${symbols.magic_find.symbol} Magic Find`],
    };
  }
}

class Blaze extends Pet {
  get stats() {
    return {
      intelligence: this.level * 1,
      defense: 10 + this.level * 0.2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.1 });
    return {
      name: "§6Nether Embodiment",
      desc: [`§7Increases all stats by §a${round(this.level * mult, 1)}% §7while on the Blazing Fortress`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.4 });
    return {
      name: "§6Bling Armor",
      desc: [`§7Upgrades §cBlaze Armor §7stats and ability by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    return {
      name: "§6Fusion-Style Potato",
      desc: [`§7Doubles effects of hot potato books`],
    };
  }
}

class EnderDragon extends Pet {
  get stats() {
    return {
      strength: this.level * 0.5,
      crit_chance: this.level * 0.1,
      crit_damage: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.25 });
    return {
      name: "§6End Strike",
      desc: [`§7Deal §a${round(this.level * mult, 1)}% §7more damage to end mobs`],
    };
  }

  get second() {
    return {
      name: "§6One With The Dragon",
      desc: [
        `§7Buffs the Aspect of the Dragons sword by §a${round(this.level * 0.5, 1)} §c${
          symbols.strength.symbol
        } Damage and §a${round(this.level * 0.3, 1)} §c${symbols.strength.symbol} Strength`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.1 });
    return {
      name: "§6Superior",
      desc: [`§7Increases all stats by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class GoldenDragon extends Pet {
  get stats() {
    const stats = {};
    if (this.level >= 100) {
      stats.strength = round(Math.max(0, this.level - 100) * 0.25 + 25 - 0.01, 0);
      stats.magic_find = round(floor(this.level / 10) * 0.5);
      stats.bonus_attack_speed = round(Math.max(0, this.level - 100) * 0.25 + 25 - 0.01, 0);
    }
    return stats;
  }

  get abilities() {
    const list = [];
    if (this.level < 100) {
      list.push(this.hatching_first);
      list.push(this.hatching_second);
    } else {
      list.push(this.first);
      list.push(this.second);
      list.push(this.third);
      list.push(this.fourth);
    }
    return list;
  }

  get hatching_first() {
    return {
      name: "§7Perks",
      desc: [`§c§l???`],
    };
  }

  get hatching_second() {
    return {
      name: "§7Hatches at level §b100",
      desc: [""],
    };
  }

  get first() {
    const value = Math.max(0, this.level - 100) * 0.5 + 50;
    return {
      name: "§6Gold's Power",
      desc: [`§7Adds §c+${round(value, 1)} ${symbols.strength.symbol} Strength §7to all §6golden §7weapons`],
    };
  }

  get second() {
    return {
      name: "§6Shining Scales",
      desc: [
        `§7For each digit in your §6gold collection §7gain §c+10 ${symbols.strength.symbol} Strength §7and §b+2 ${symbols.magic_find.symbol} Magic Find`,
      ],
    };
  }

  get third() {
    const value = Math.max(0, this.level - 100) * 0.2 + 20;
    return {
      name: "§6Dragon's Greed",
      desc: [
        `§7Gain §a${round(value, 1)}% §7of your §b${symbols.magic_find.symbol} Magic Find §7as §c${symbols.strength.symbol} Strength`,
      ],
    };
  }

  get fourth() {
    const value = this.level * 0.00125;

    return {
      name: "§6Legendary Treasure",
      desc: [`§7Gain §c${round(value, 4)}% §7damage for every milion coins in your bank`],
    };
  }
}

class Enderman extends Pet {
  get stats() {
    return {
      crit_damage: this.level * 0.75,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    if (this.rarity >= MYTHIC) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.2, epic: 0.3 });
    return {
      name: "§6Enderian",
      desc: [`§7Take §a${round(this.level * mult, 1)}% §7less damage from end monsters`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.5, epic: 0.5 });
    return {
      name: "§6Teleport Savvy",
      desc: [
        `§7Buffs the Aspect of the End ability granting §a${round(
          this.level * mult,
          1
        )} §7weapon damage for 5s on use.`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Zealot Madness",
      desc: [`§7Increases your odds to find a special Zealot by §a${round(this.level * mult, 1)}%.`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { mythic: 0.4 });
    return {
      name: "§6Enderman Slayer",
      desc: [`§7Gain +§a${round(this.level * mult, 1)}% §7more combat xp from endermen`],
    };
  }
}

class Ghoul extends Pet {
  get stats() {
    return {
      intelligence: this.level * 0.75,
      health: this.level * 1,
      ferocity: this.level * 0.05,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.25 });
    return {
      name: "§6Amplified Healing",
      desc: [`§7Increase all healing by §a${round(this.level * mult, 1)}%`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.5 });
    return {
      name: "§6Zombie Arm",
      desc: [`§7Increase the health and range of the Zombie sword by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 1 });
    return {
      name: "§6Reaper Soul",
      desc: [`§7Increases the health and lifespan of the Reaper Scythe zombies by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Golem extends Pet {
  get stats() {
    return {
      health: this.level * 1.5,
      strength: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.3 });
    return {
      name: "§6Last Stand",
      desc: [`§7While less than 15% HP, deal §a${round(this.level * mult, 1)}% §7more damage`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.2, legendary: 0.25 });
    return {
      name: "§6Ricochet",
      desc: [
        `§7Your iron plating causes §a${round(this.level * mult, 1)}% §7of attacks to ricochet and hit the attacker`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 3 });
    return {
      name: "§6Toss",
      desc: [
        `§7Every 5 hits, throw the enemy up into the air and deal §a${round(
          200 + this.level * mult,
          1
        )}% §7damage (10s cooldown)`,
      ],
    };
  }
}

class Griffin extends Pet {
  get stats() {
    return {
      strength: this.level * 0.25,
      crit_chance: this.level * 0.1,
      crit_damage: this.level * 0.5,
      intelligence: this.level * 0.1,
      magic_find: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= UNCOMMON) {
      list.push(this.second);
    }
    if (this.rarity >= EPIC) {
      list.push(this.third);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Odyssey",
      desc: [
        `§2Mythological creatures §7you find and burrows you dig scale in §cdifficulty §7and §6rewards §7based on your equipped Griffin's rarity.`,
      ],
    };
  }

  get second() {
    const regen = getValue(this.rarity, { uncommon: "V", rare: "VI", legendary: "VII" });
    const strength = getValue(this.rarity, { uncommon: "VII", epic: "VIII" });
    return {
      name: "§6Legendary Constitution",
      desc: [`§7Permanent §cRegeneration ${regen} §7and §4Strength ${strength}§7.`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { epic: 0.16, legendary: 0.2 });
    return {
      name: "§6Perpetual Empathy",
      desc: [
        `§7Heal nearby players for §a${round(this.level * mult, 0)}% §7of the final damage you receive.`,
        `§8Excludes other griffins.`,
      ],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { legendary: 0.14 });
    return {
      name: "§6King of Kings",
      desc: [
        `§7Gain §c+${round(1 + this.level * mult, 1)}% §c${symbols.strength.symbol} Strength §7when above §c85% §7health.`,
      ],
    };
  }
}

class Guardian extends Pet {
  get stats() {
    return {
      intelligence: this.level * 1,
      defense: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.02, uncommon: 0.04, rare: 0.1, epic: 0.15, legendary: 0.2 });
    return {
      name: "§6Lazerbeam",
      desc: [
        `§7Zap your enemies for §b${round(this.level * mult, 1)}x §7your §b${
          symbols.intelligence.symbol
        } Intelligence §7every §a3s`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.25, epic: 0.3 });
    return {
      name: "§6Enchanting Exp Boost",
      desc: [`§7Boosts your Enchanting exp by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Mana Pool",
      desc: [`§7Regenerate §b${round(this.level * mult, 1)}% §7extra mana, doubled when near or in water`],
    };
  }
}

class Horse extends Pet {
  get stats() {
    return {
      intelligence: this.level * 0.5,
      speed: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Ridable",
      desc: [`§7Right-click your summoned pet to ride it!`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 1.1, epic: 1.2 });
    return {
      name: "§6Run",
      desc: [`§7Increase the speed of your mount by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Ride Into Battle",
      desc: [`§7When riding your horse, gain +§a${round(this.level * mult, 1)}% §7bow damage`],
    };
  }
}

class Hound extends Pet {
  get stats() {
    return {
      strength: this.level * 0.4,
      bonus_attack_speed: this.level * 0.15,
      ferocity: this.level * 0.05,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.05 });
    return {
      name: "§6Scavenger",
      desc: [`§7Gain +§a${round(this.level * mult, 1)} §7coins per monster kill`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { legendary: 0.1 });
    return {
      name: "§6Finder",
      desc: [`§7Increases the chance for monsters to drop their armor by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.1 });
    return {
      name: "§6Fury Claws",
      desc: [`§7Grants ${round(this.level * mult, 1)}	§e${symbols.bonus_attack_speed.symbol} Bonus Attack Speed`],
    };
  }
}

class MagmaCube extends Pet {
  get stats() {
    return {
      health: this.level * 0.5,
      defense: this.level * 0.33,
      strength: this.level * 0.2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.2, rare: 0.25, epic: 0.3 });
    return {
      name: "§6Slimy Minions",
      desc: [`§7Slime minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.2, epic: 0.25 });
    return {
      name: "§6Salt Blade",
      desc: [`§7Deal §a${round(this.level * mult, 1)}% §7more damage to slimes`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.5 });
    return {
      name: "§6Hot Ember",
      desc: [`§7Buffs the stats of Ember Armor by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Phoenix extends Pet {
  get stats() {
    return {
      strength: 10 + this.level * 0.5,
      intelligence: 50 + this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    const start_strength = getValue(this.rarity, { epic: 10, legendary: 15 });
    const mult_strength = getValue(this.rarity, { epic: 0.1, legendary: 0.15 });
    const mult_time = getValue(this.rarity, { epic: 0.02 });
    return {
      name: "§6Rekindle",
      desc: [
        `§7Before death, become §eimmune §7and gain §c${start_strength + round(this.level * mult_strength, 1)} ${
          symbols.strength.symbol
        } Strength §7for ${2 + round(this.level * mult_time, 1)} §7seconds`,
        `§73 minutes cooldown`,
      ],
    };
  }

  get second() {
    const mult_damage = getValue(this.rarity, { epic: 0.12, legendary: 0.14 });
    const mult_time = getValue(this.rarity, { epic: 0.04 });
    return {
      name: "§6Fourth Flare",
      desc: [
        `§7On 4th melee strike, §6ignite §7mobs, dealing §c${1 + round(this.level * mult_damage, 1)}x §7your §9${
          symbols.crit_damage.symbol
        } Crit Damage §7each second for §a${2 + floor(this.level * mult_time, 0)} §7seconds`,
      ],
    };
  }

  get third() {
    return {
      name: "§6Magic Bird",
      desc: [`§7You may always fly on your private island`],
    };
  }

  get fourth() {
    return {
      name: "§6Eternal Coins",
      desc: [`§7Don't lose coins from death.`],
    };
  }
}

class Pigman extends Pet {
  get stats() {
    return {
      strength: this.level * 0.5,
      defense: this.level * 0.5,
      ferocity: this.level * 0.05,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.3 });
    return {
      name: "§6Bacon Farmer",
      desc: [`§7Pig minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }

  get second() {
    const mult_damage = getValue(this.rarity, { epic: 0.4 });
    const mult_strength = getValue(this.rarity, { epic: 0.25 });
    return {
      name: "§6Pork Master",
      desc: [
        `§7Buffs the Pigman sword by §a${round(this.level * mult_damage, 1)} §c${
          symbols.strength.symbol
        } Damage and §7§a${round(this.level * mult_strength, 1)} §c${symbols.strength.symbol} Strength`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Giant Slayer",
      desc: [`§7Deal §a${round(this.level * mult, 1)}% §7extra damage to monsters level 100 and up`],
    };
  }
}

class Rat extends Pet {
  get stats() {
    return {
      strength: this.level * 0.5,
      crit_damage: this.level * 0.1,
      health: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Morph",
      desc: [`§7Right-click your summoned pet to morph into it!`],
    };
  }

  get second() {
    return {
      name: "§6CHEESE!",
      desc: [`§7As a Rat, you smell §e§lCHEESE §r§7nearby! Yummy!`],
    };
  }

  get third() {
    const mult_mf = getValue(this.rarity, { legendary: 0.05 });
    const mult_time = getValue(this.rarity, { legendary: 0.2 });
    return {
      name: "§6Rat's Blessing",
      desc: [
        `§7Has a chance to grant a random player §b+${floor(2 + this.level * mult_mf, 1)} ${
          symbols.magic_find.symbol
        } Magic Find §7for §a${round(
          20 + this.level * mult_time,
          0
        )} §7seconds after finding a yummy piece of Cheese! If the player gets a drop during this buff, you have a §a20% §7to get it too.`,
      ],
    };
  }
}

class SkeletonHorse extends Pet {
  get stats() {
    return {
      speed: this.level * 0.5,
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first, this.second, this.third];
    return list;
  }

  get first() {
    return {
      name: "§6Ridable",
      desc: [`§7Right-click your summoned pet to ride it!`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { legendary: 1.5 });
    return {
      name: "§6Run",
      desc: [`§7Increase the speed of your mount by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.4 });
    return {
      name: "§6Ride Into Battle",
      desc: [`§7When riding your horse, gain +§a${round(this.level * mult, 1)}% §7bow damage`],
    };
  }
}

class Skeleton extends Pet {
  get stats() {
    return {
      crit_chance: this.level * 0.15,
      crit_damage: this.level * 0.3,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.15, epic: 0.2 });
    return {
      name: "§6Bone Arrows",
      desc: [`§7Increase arrow damage by §a${round(this.level * mult, 1)}% §7which is tripled while in dungeons`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.15, epic: 0.17, legendary: 0.2 });
    return {
      name: "§6Combo",
      desc: [
        `§7Gain a combo stack for every bow hit granting +§a3 §c${symbols.strength.symbol} Strength§7. Max §a${round(
          this.level * mult,
          1
        )} §7stacks, stacks disappear after 8 seconds`,
      ],
    };
  }

  get third() {
    return {
      name: "§6Skeletal Defense",
      desc: [
        `§7Your skeleton shoots an arrow dealing §a30x §7your §9${symbols.crit_damage.symbol} Crit Damage §7when a mob gets close to you (5s cooldown)`,
      ],
    };
  }
}

class Snowman extends Pet {
  get stats() {
    return {
      damage: this.level * 0.25,
      strength: this.level * 0.25,
      crit_damage: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first, this.second, this.third];
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { legendary: 0.04 });
    return {
      name: "§6Blizzard",
      desc: [`§7Slow all enemies within §a${4 + round(this.level * mult, 1)} §7blocks`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { legendary: 0.15 });
    return {
      name: "§6Frostbite",
      desc: [
        `§7Your freezing aura slows enemy attacks causing you to take §a${floor(
          this.level * mult,
          1
        )}% §7reduced damage`,
      ],
    };
  }

  get third() {
    return {
      name: "§6Snow Cannon",
      desc: [
        `§7Your snowman fires a snowball dealing §a5x §7your §c${symbols.strength.symbol} Strength §7when a mob gets close to you (1s cooldown)`,
      ],
    };
  }
}

class Spider extends Pet {
  get stats() {
    return {
      strength: this.level * 0.1,
      crit_chance: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1 });
    return {
      name: "§6One With The Spider",
      desc: [
        `§7Gain §a${round(this.level * mult, 1)} §c${symbols.strength.symbol} Strength §7for every nearby spider`,
        `§8Max 10 spiders`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.4 });
    return {
      name: "§6Web-weaver",
      desc: [`§7Upon hitting a monster it becomes slowed by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Spider Whisperer",
      desc: [`§7Spider and tarantula minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }
}

class Spirit extends Pet {
  get stats() {
    return {
      intelligence: this.level * 1,
      speed: this.level * 0.3,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Spirit Assistance",
      desc: [`§7Spawns and assists you when you are ghost in dungeons.`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.45 });
    return {
      name: "§6Spirit Cooldowns",
      desc: [`§7Reduces the cooldown of your ghost abilities in dungeons by §a${round(5 + this.level * mult, 1)}%§7.`],
    };
  }

  get third() {
    return {
      name: "§6Half Life",
      desc: [
        `§7If you are the first player to die in a dungeon, the score penalty for that death is reduced to §a1§7.`,
      ],
    };
  }
}

class Tarantula extends Pet {
  get stats() {
    return {
      crit_chance: this.level * 0.1,
      crit_damage: this.level * 0.3,
      strength: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.3 });
    return {
      name: "§6Webbed Cells",
      desc: [`§7Anti-healing is §a${round(this.level * mult, 1)}% §7less effective against you`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.5 });
    return {
      name: "§6Eight Legs",
      desc: [`§7Decreases the mana cost of Spider, Tarantula and Thorn's boots by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.4 });
    return {
      name: "§6Arachnid Slayer",
      desc: [`§7Gain +§a${round(this.level * mult, 1)}% §7more combat xp from spiders`],
    };
  }
}

class Tiger extends Pet {
  get stats() {
    return {
      strength: 5 + this.level * 0.1,
      crit_chance: this.level * 0.05,
      crit_damage: this.level * 0.5,
      ferocity: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.2, epic: 0.3 });
    return {
      name: "§6Merciless Swipe",
      desc: [`§7Gain 	§c+${round(this.level * mult, 1)}% ${symbols.ferocity.symbol} Ferocity.`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.3, epic: 0.55 });
    return {
      name: "§6Hemorrhage",
      desc: [`§7Melee attacks reduce healing by §6${round(this.level * mult, 1)}% §7for §a10s`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.2 });
    return {
      name: "§6Apex Predator",
      desc: [
        `§7Deal §c+${round(this.level * mult, 1)}% §7damage against targets with no other mobs within §a15 §7blocks`,
      ],
    };
  }
}

class Turtle extends Pet {
  get stats() {
    return {
      health: this.level * 0.5,
      defense: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.27 });
    return {
      name: "§6Turtle Tactics",
      desc: [`§7Gain §a+${round(3 + this.level * mult, 1)}% ${symbols.defense.symbol} Defense`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.15, legendary: 0.25 });
    return {
      name: "§6Genius Amniote",
      desc: [
        `§7Grants §a+${round(5 + this.level * mult, 1)} ${
          symbols.defense.symbol
        } Defense §7for every player around you, up to 4 nearby players.`,
      ],
    };
  }

  get third() {
    return {
      name: "§6Unflippable",
      desc: [`§7Gain §aimmunity §7to knockback`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Turtle Shell",
      desc: [`§7When under §c33% §7maximum HP, you take §a${round(this.level * mult, 1)}% §7less damage.`],
    };
  }
}

class Wolf extends Pet {
  get stats() {
    return {
      health: this.level * 0.5,
      crit_damage: this.level * 0.1,
      speed: this.level * 0.2,
      true_defense: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.2, epic: 0.3 });
    return {
      name: "§6Alpha Dog",
      desc: [`§7Take §a${round(this.level * mult, 1)}% §7less damage from wolves`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.1, epic: 0.15 });
    return {
      name: "§6Pack Leader",
      desc: [
        `§7Gain §a${round(this.level * mult, 1)} §9 ${
          symbols.crit_damage.symbol
        } Crit Damage §7for every nearby wolf monsters`,
        `§8Max 10 wolves`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Combat Exp Boost",
      desc: [`§7Boosts your Combat exp by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class GrandmaWolf extends Pet {
  get stats() {
    return {
      health: this.level * 1,
      strength: this.level * 0.25,
    };
  }

  get abilities() {
    const list = [this.first];
    return list;
  }

  get first() {
    return {
      name: "§6Kill Combo",
      desc: [
        `§7Gain buffs for combo kills. Effects stack as you increase your combo.`,
        ``,
        `§a5 Combo §8(lasts §a${Math.floor((8 + this.level * 0.02) * 10) / 10}s§8)`,
        `§8+§b3% §b${symbols.magic_find.symbol} Magic Find`,
        `§a10 Combo §8(lasts §a${Math.floor((6 + this.level * 0.02) * 10) / 10}s§8)`,
        `§8+§610 §7coins per kill`,
        `§a15 Combo §8(lasts §a${Math.floor((4 + this.level * 0.02) * 10) / 10}s§8)`,
        `§8+§b3% §b${symbols.magic_find.symbol} Magic Find`,
        `§a20 Combo §8(lasts §a${Math.floor((3 + this.level * 0.02) * 10) / 10}s§8)`,
        `§8+§315% §7Combat Exp`,
        `§a25 Combo §8(lasts §a${Math.floor((3 + this.level * 0.01) * 10) / 10}s§8)`,
        `§8+§b3% §b${symbols.magic_find.symbol} Magic Find`,
        `§a30 Combo §8(lasts §a${Math.floor((2 + this.level * 0.01) * 10) / 10}s§8)`,
        `§8+§610 §7coins per kill`,
      ],
    };
  }
}

class Zombie extends Pet {
  get stats() {
    return {
      crit_damage: this.level * 0.3,
      health: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.15, epic: 0.25 });
    return {
      name: "§6Chomp",
      desc: [`§7Gain +§a${round(this.level * mult, 1)} §7hp per zombie kill`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.2 });
    return {
      name: "§6Rotten Blade",
      desc: [`§7Deal §a${round(this.level * mult, 1)}% §7more damage to zombies`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Living Dead",
      desc: [`§7Increases the defense of all undead armor sets by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Giraffe extends Pet {
  get stats() {
    return {
      health: this.level * 1,
      crit_chance: this.level * 0.05,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.05, uncommon: 0.1, rare: 0.15, epic: 0.2, legendary: 0.25 });
    return {
      name: "§6Good Heart",
      desc: [`§7Regen §c${round(this.level * mult, 1)} ${symbols.health.symbol} §7per second`],
    };
  }

  get second() {
    const mult_strength = getValue(this.rarity, { rare: 0.4, epic: 0.5 });
    const mult_cd = getValue(this.rarity, { rare: 0.1, epic: 0.25, legendary: 0.4 });
    return {
      name: "§6Higher Ground",
      desc: [
        `§7Grants §c+${round(this.level * mult_strength, 1)} ${symbols.strength.symbol} Strength §7and §9+${round(
          this.level * mult_cd + 20,
          1
        )} ${symbols.crit_damage.symbol} Crit Damage §7when mid air or jumping`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Long Neck",
      desc: [`§7See enemies from afar and gain §a${round(this.level * mult, 1)}% §7dodge chance`],
    };
  }
}

class Lion extends Pet {
  get stats() {
    return {
      strength: this.level * 0.5,
      speed: this.level * 0.25,
      ferocity: this.level * 0.05,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.03, uncommon: 0.05, rare: 0.1, epic: 0.15, legendary: 0.2 });
    return {
      name: "§6Primal Force",
      desc: [
        `§7Adds §c+${round(this.level * mult, 1)} ${symbols.strength.symbol} Damage §7and §c+${round(this.level * mult, 1)} ${
          symbols.strength.symbol
        } Strength §7to your weapons`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.75, epic: 1 });
    return {
      name: "§6First Pounce",
      desc: [
        `§7First Strike, Triple-Strike, and §d§lCombo §r§7are §a${round(this.level * mult, 1)}% §7more effective.`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.15 });
    return {
      name: "§6King of the Jungle",
      desc: [
        `§7Deal §c+${round(this.level * mult, 1)}% ${symbols.strength.symbol} Damage §7against mobs that have attacked you.`,
      ],
    };
  }
}

class Monkey extends Pet {
  get stats() {
    return {
      speed: this.level * 0.2,
      intelligence: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.4, uncommon: 0.5, epic: 0.6 });
    return {
      name: "§6Treeborn",
      desc: [
        `§7Grants §a+${round(this.level * mult, 1)} §6${
          symbols.foraging_fortune
        } Foraging Fortune§7, which increases your chance at double logs`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.75, epic: 1 });
    return {
      name: "§6Vine Swing",
      desc: [`§7Gain +§a${round(this.level * mult, 1)}	§f${symbols.speed.symbol} Speed §7while in The Park`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.5 });
    return {
      name: "§6Evolved Axes",
      desc: [`§7Reduce the cooldown of Jungle Axe and Treecapitator by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Ocelot extends Pet {
  get stats() {
    return {
      speed: this.level * 0.5,
      ferocity: this.level * 0.1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.2, uncommon: 0.25, epic: 0.3 });
    return {
      name: "§6Foraging Exp Boost",
      desc: [`§7Boosts your Foraging exp by §a${round(this.level * mult, 1)}%`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.3 });
    return {
      name: "§6Tree Hugger",
      desc: [`§7Foraging minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Tree Essence",
      desc: [`§7Gain a §a${round(this.level * mult, 1)}% §7chance to get exp from breaking a log`],
    };
  }
}

class BabyYeti extends Pet {
  get stats() {
    return {
      intelligence: this.level * 0.75,
      strength: this.level * 0.4,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.5 });
    return {
      name: "§6Cold Breeze",
      desc: [
        `§7Gives §a${round(this.level * mult, 1)} §c${symbols.strength.symbol} Strength §7and §9${
          symbols.crit_damage.symbol
        } Crit Damage §7when near snow`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.5, legendary: 0.75 });
    return {
      name: "§6Ice Shields",
      desc: [`§7Gain §a${floor(this.level * mult, 1)}% §7of your strength as §a${symbols.defense.symbol} Defense`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 1 });
    return {
      name: "§6Yeti Fury",
      desc: [
        `§7Buff the Yeti sword by §a${round(this.level * mult, 1)} §c${symbols.strength.symbol} Damage §7and §9${
          symbols.intelligence.symbol
        } Intelligence`,
      ],
    };
  }
}

class BlueWhale extends Pet {
  get stats() {
    return {
      health: this.level * 2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.5, uncommon: 1, rare: 1.5, epic: 2, legendary: 2.5 });
    return {
      name: "§6Ingest",
      desc: [`§7All potions heal §c+${round(this.level * mult, 1)} ${symbols.health.symbol}`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.01 });
    const health = getValue(this.rarity, { rare: "30.0", epic: "25.0", legendary: "20.0" });
    return {
      name: "§6Bulk",
      desc: [
        `§7Gain §a${round(this.level * mult, 1)} ${symbols.defense.symbol} Defense §7per §c${health} Max ${
          symbols.health.symbol
        } Health`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.2 });
    return {
      name: "§6Archimedes",
      desc: [`§7Gain §c+${round(this.level * mult, 1)}% Max ${symbols.health.symbol} Health`],
    };
  }
}

class Ammonite extends Pet {
  get stats() {
    return {
      sea_creature_chance: this.level * 0.07,
    };
  }

  get abilities() {
    const list = [this.first, this.second, this.third];
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { legendary: 0.01 });
    return {
      name: "§6Heart of the Sea",
      desc: [
        `§7Each Heart of the Mountain level grants §3+${round(this.level * mult, 1)} ${
          symbols.sea_creature_chance.symbol
        } Sea Creature Chance`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { legendary: 0.02 });
    return {
      name: "§6Not a Snail",
      desc: [
        `§7Each fishing and mining level grants §f+${round(this.level * mult, 1)} ${
          symbols.speed.symbol
        } Speed §7and §a+${round(this.level * mult, 1)} ${symbols.defense.symbol} Defense`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.006 });
    return {
      name: "§6Gift of the Ammonite",
      desc: [`§7Increases your fishing speed by §a${round(this.level * mult, 1)}% §7for each mining level`],
    };
  }
}

class Dolphin extends Pet {
  get stats() {
    return {
      sea_creature_chance: this.level * 0.05,
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.03, uncommon: 0.04, epic: 0.05 });
    const max = getValue(this.rarity, { common: 15, uncommon: 20, epic: 25 });
    return {
      name: "§6Pod Tactics",
      desc: [
        `§7Increases your fishing speed by §a${round(
          this.level * mult,
          1
        )}% §7for each nearby player within 10 blocks up to §a${max}%`,
      ],
    };
  }

  get second() {
    const mult = this.rarity >= EPIC ? 0.1 : 0.07;
    return {
      name: "§6Echolocation",
      desc: [`§7Increases sea creatures catch chance by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    return {
      name: "§6Splash Surprise",
      desc: [`§7Stun sea creatures for §a5s §7after fishing them up`],
    };
  }
}

class FlyingFish extends Pet {
  get stats() {
    return {
      defense: this.level * 0.5,
      strength: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    if (this.rarity >= MYTHIC) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { rare: 0.4, epic: 0.5 });
    return {
      name: "§6Quick Reel",
      desc: [`§7Increases fishing speed by §a${round(this.level * mult, 1)}%`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.8, epic: 1 });
    const type = getValue(this.rarity, { rare: "water", mythic: "lava" });
    return {
      name: getValue(this.rarity, { rare: "§6Water Bender", mythic: "§6Lava Bender" }),
      desc: [
        `§7Gives §a${round(this.level * mult, 1)} §c${symbols.strength.symbol} Strength §7and §a${
          symbols.defense.symbol
        } Defense §7when near ${type}`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.2 });
    const armor = getValue(this.rarity, { legendary: "Diver Armor", mythic: "Magma Lord armor" });
    return {
      name: getValue(this.rarity, { rare: "§6Deep Sea Diver", mythic: "§6Magmatic Diver" }),
      desc: [`§7Increases the stats of ${armor} by §a${round(this.level * mult, 1)}%`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { mythic: 0.5 });
    return {
      name: "§6Rapid Decay",
      desc: [`§7Increases the chance to activate Flash Enchantment by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Megalodon extends Pet {
  get stats() {
    return {
      strength: this.level * 0.5,
      magic_find: this.level * 0.1,
      ferocity: this.level * 0.05,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.25 });
    return {
      name: "§6Blood Scent",
      desc: [
        `§7Deal up to §c+${round(mult * this.level, 1)}% ${
          symbols.strength.symbol
        } §7Damage based on the enemy's missing health`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.2 });
    return {
      name: "§6Enhanced scales",
      desc: [`§7Increases the stats of Shark Armor by §a${round(mult * this.level, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.5 });
    return {
      name: "§6Feeding frenzy",
      desc: [
        `§7On kill gain §c${round(mult * this.level, 1)} ${symbols.strength.symbol} Damage §7and §f${
          symbols.speed.symbol
        } Speed §7for 5 seconds`,
      ],
    };
  }
}

class Squid extends Pet {
  get stats() {
    return {
      health: this.level * 0.5,
      intelligence: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.5, uncommon: 0.75, epic: 1 });
    return {
      name: "§6More Ink",
      desc: [`§7Gain a §a${round(this.level * mult, 1)}% §7chance to get double drops from squids`],
    };
  }

  get second() {
    const mult_damage = getValue(this.rarity, { rare: 0.3, epic: 0.4 });
    const mult_strength = getValue(this.rarity, { rare: 0.1, epic: 0.2 });
    return {
      name: "§6Ink Specialty",
      desc: [
        `§7Buffs the Ink Wand by §a${round(this.level * mult_damage, 1)} §c${symbols.strength.symbol} Damage §7and §a${round(
          this.level * mult_strength,
          1
        )} §c${symbols.strength.symbol} Strength`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.3 });
    return {
      name: "§6Fishing Exp Boost",
      desc: [`§7Boosts your Fishing exp by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Jellyfish extends Pet {
  get stats() {
    return {
      health: this.level * 2,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult_health = getValue(this.rarity, { epic: 1 });
    const mult_mana = getValue(this.rarity, { epic: 0.5 });
    return {
      name: "§6Radiant Regeneration",
      desc: [
        `§7While in dungeons, increase your base health regen by §a${round(
          this.level * mult_health,
          1
        )}% §7and reduces the mana cost of Power Orbs by §a${round(this.level * mult_mana, 1)}%§7.`,
      ],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.01 });
    return {
      name: "§6Stored Energy",
      desc: [
        `§7While in dungeons, for every §c2,000 HP §7you heal teammates the cooldown of §aWish §7is reduced by §a${round(
          this.level * mult,
          2
        )}s§7, up to §a30s§7.`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.5 });
    return {
      name: "§6Powerful Potions",
      desc: [`§7While in dungeons, increase the effectiveness of Dungeon Potions by §a${round(this.level * mult, 1)}%`],
    };
  }
}

class Parrot extends Pet {
  get stats() {
    return {
      crit_damage: this.level * 0.1,
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { epic: 0.15, legendary: 0.2 });
    return {
      name: "§6Flamboyant",
      desc: [`§7Adds §a${Math.max(round(this.level * mult, 0), 1)} §7levels to intimidation accessories`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { epic: 0.35 });
    return {
      name: "§6Repeat",
      desc: [`§7Boosts potion duration by §a${round(5 + this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Bird Discourse",
      desc: [
        `§7Gives §c+${round(5 + this.level * mult, 1)} ${symbols.strength.symbol} Strength §7to players within §a20 §7blocks`,
        `§7Doesn't stack`,
      ],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { legendary: 0.2 });
    return {
      name: "§6Parrot Feather Infusion",
      desc: [
        `§7When summoned or in your pets menu, boost the duration of consumed §cGod Potions §7by §a${round(
          this.level * mult,
          1
        )}%`,
      ],
    };
  }
}

class Sheep extends Pet {
  get stats() {
    return {
      ability_damage: this.level * 0.2,
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.15, epic: 0.2 });
    return {
      name: "§6Mana Saver",
      desc: [`§7Reduces the mana cost of abilities by §a${round(this.level * mult, 1)}%`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.1 });
    return {
      name: "§6Overheal",
      desc: [`§7Gives a §a${round(this.level * mult, 1)}% §7shield after not taking damage for 10s`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.25 });
    return {
      name: "§6Dungeon Wizard",
      desc: [`§7Increases your total mana by §a${round(this.level * mult, 1)}% §7while in dungeons`],
    };
  }
}

class Jerry extends Pet {
  get stats() {
    return {
      intelligence: this.level * -1,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    if (this.rarity >= MYTHIC) {
      list.push(this.fourth);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Jerry",
      desc: [`§7Gain §a50% §7chance to deal your regular damage`],
    };
  }

  get second() {
    return {
      name: "§6Jerry",
      desc: [`§7Gain §a100% §7chance to receive a normal amount of drops from mobs`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.1, mythic: 0.5 });
    return {
      name: "§6Jerry",
      desc: [`§7Actually adds §c${Math.floor(this.level * mult)} damage §7to the Aspect of the Jerry`],
    };
  }

  get fourth() {
    return {
      name: "§6Jerry",
      desc: [`§7Tiny chance to find Jerry Candies when killing mobs`],
    };
  }
}

class Bingo extends Pet {
  get stats() {
    return {
      health: 25 + this.level * 0.75,
      strength: 5 + this.level * 0.2,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= UNCOMMON) {
      list.push(this.second);
    }
    if (this.rarity >= RARE) {
      list.push(this.third);
    }
    if (this.rarity >= EPIC) {
      list.push(this.fourth);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fifth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.2 });
    return {
      name: "§6Lucky Looting",
      desc: [`§7Gain §c${floor(5 + this.level * mult, 1)}% §7more collection items from any source!`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { uncommon: 0.1 });
    return {
      name: "§6Fast Learner",
      desc: [`§7Gain §c${floor(5 + this.level * mult, 1)}% §7more Skill Experience and §9Slayer §7Experience.`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { rare: 0.3 });
    return {
      name: "§6Chimera",
      desc: [`§7Increases your base stats of your active pet by §c${floor(10 + this.level * mult, 1)}% §7per level.`],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { epic: 0.009 });
    return {
      name: "§6Scavenger",
      desc: [`§7Gain §c${round(0.1 + this.level * mult, 1)} §7more §l§6Coins §r§7per monster level on kill.`],
    };
  }

  get fifth() {
    const mult = getValue(this.rarity, { legendary: 0.08 });
    return {
      name: "§6Scavenger",
      desc: [`§7Recover §b${round(2 + this.level * mult, 1)} mana §7when using mana.`],
    };
  }
}

class Wisp extends Pet {
  get stats() {
    return {
      true_defense: this.level * 0.1,
      health: this.level * 1,
      intelligence: this.level * 0.5,
    };
  }

  get abilities() {
    const list = [this.first, this.second, this.third];
    if (this.rarity >= RARE) {
      list.push(this.fourth);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fifth);
    }
    return list;
  }

  get first() {
    return {
      name: "§6Drophammer",
      desc: [`§7Lets you break fire pillars`],
    };
  }

  get second() {
    const bonuses = [
      { kills: 0, defense: 0, true_defense: 0 },
      { kills: 100, defense: 30, true_defense: 3 },
      { kills: 200, defense: 60, true_defense: 6 },
      { kills: 300, defense: 90, true_defense: 9 },
      { kills: 500, defense: 135, true_defense: 14 },
      { kills: 800, defense: 180, true_defense: 18 },
      { kills: 1200, defense: 225, true_defense: 23 },
      { kills: 1750, defense: 270, true_defense: 27 },
      { kills: 2500, defense: 315, true_defense: 32 },
      { kills: 3500, defense: 360, true_defense: 36 },
      { kills: 5000, defense: 405, true_defense: 41 },
      { kills: 10000, defense: 465, true_defense: 47 },
      { kills: 25000, defense: 500, true_defense: 50 },
      { kills: 50000, defense: 535, true_defense: 53 },
      { kills: 100000, defense: 570, true_defense: 57 },
      { kills: 125000, defense: 585, true_defense: 58 },
      { kills: 150000, defense: 595, true_defense: 59 },
      { kills: 200000, defense: 600, true_defense: 60 },
    ];

    const blaze_kills = this.extra?.blaze_kills ?? 0;

    let maxTier = false;
    let bonusIndex = bonuses.findIndex((x) => x.kills > blaze_kills);

    if (bonusIndex === -1) {
      bonusIndex = bonuses.length;
      maxTier = true;
    }

    const current = bonuses[bonusIndex - 1];

    let next = null;
    if (!maxTier) {
      next = bonuses[bonusIndex];
    }

    return {
      name: "§6Bulwark",
      desc: [
        `§7Kill Blazes to gain defense against them`,
        `§7Bonus: §a+${current.defense} ${symbols.defense.symbol} §7& §f+${current.true_defense} ${symbols.true_defense.symbol}`,
        !maxTier
          ? `§7Next Upgrade: §a+${next.defense} ${symbols.defense.symbol} §7& §f+${next.true_defense} ${
              symbols.true_defense.symbol
            } §7(§a${blaze_kills.toLocaleString()}§7/§c${next.kills.toLocaleString()}§7)`
          : "§aMAXED OUT!",
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { uncommon: 0.3, rare: 0.35, epic: 0.4 });
    const prc = round(this.level * mult, 1);

    return {
      name: "§6Blaze Slayer",
      desc: [`§7Gain §a+${prc}% §7more combat xp from Blazes`],
    };
  }

  get fourth() {
    const mult1 = getValue(this.rarity, { rare: 0.15, epic: 0.2, legendary: 0.25 });
    const mult2 = getValue(this.rarity, { rare: 0.04, epic: 0.07, legendary: 0.1 });
    const val1 = round(this.level * mult1, 1);
    const val2 = round(this.level * mult2, 1);
    return {
      name: "§6Extinguish",
      desc: [
        `§7While in combat on the Crimson Isle, spawn a pool every §a8s§7. Bathing in it heals §c${val1}% ${symbols.health.symbol} Health §7now and §c${val2}% ${symbols.health.symbol} Health§7/s for §a8s`,
      ],
    };
  }

  get fifth() {
    const mult = getValue(this.rarity, { legendary: 0.4 });
    return {
      name: "§6Cold Fusion",
      desc: [`§7Regenerate mana §b${round(this.level * mult, 1)}% §7faster`],
    };
  }
}

class MooshroomCow extends Pet {
  get stats() {
    return {
      health: this.level * 1,
      farming_fortune: 10 + this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.2, rare: 0.3 });

    return {
      name: "§6Efficient Mushrooms",
      desc: [`§7Mushroom and Mycelium minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.99 });
    return {
      name: "§6Mushroom Eater",
      desc: [
        `§7When breaking crops, there is a §a${round(this.level * mult + 1.01, 1)}% §7chance that a mushroom will drop`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.2 });

    return {
      name: "§6Farming Strength",
      desc: [
        `§7Gain §6+1 ${symbols.farming_fortune.symbol} Farming Fortune §7per every §c${round(40 - this.level * mult, 1)} ${
          symbols.strength.symbol
        } Strength`,
      ],
    };
  }
}

class Snail extends Pet {
  get stats() {
    return {
      intelligence: this.level * 1,
    };
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.2, rare: 0.3 });

    return {
      name: "§6Red Sand Enjoyer",
      desc: [`§7Red Sand minions work §a${round(this.level * mult, 1)}% §7faster while on your island`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { rare: 0.3, epic: 0.5 });

    return {
      name: "§6Slow Moving",
      desc: [
        `§7Converts all §f${symbols.speed.symbol} Speed §7over 100 into §6${
          symbols.mining_fortune.symbol
        } Mining Fortune §7for Non-Ores at §a${round(this.level * mult, 1)}% §7efficiency`,
        // `Current bonus: +0 ${symbols.mining_fortune.symbol} Mining Fortune`,
      ],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { legendary: 0.01 });

    return {
      name: "§6Slow But Efficient",
      desc: [
        `§7Reduces the mana cost of §9Utility Abilities §7by §a${round(this.level * mult, 1)}% §7for every +15 §f${
          symbols.speed.symbol
        } Speed §7converted`,
      ],
    };
  }
}

class Kuudra extends Pet {
  get stats() {
    return {
      health: this.level * 4,
      strength: this.level * 0.4,
    };
  }

  get abilities() {
    const list = [this.first, this.second];
    if (this.rarity >= RARE) {
      list.push(this.third);
    }
    if (this.rarity >= EPIC) {
      list.push(this.fourth);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.fifth);
    }
    return list;
  }

  get first() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.15, epic: 0.2 });

    return {
      name: "§6Crimson",
      desc: [`§7Grants §a${round(this.level * mult, 1)}% §7extra crimson essence`],
    };
  }

  get second() {
    const mult = getValue(this.rarity, { common: 0.1, uncommon: 0.15, epic: 0.2 });

    return {
      name: "§6Wither Bait",
      desc: [`§7Increases the odds of finding a vanquisher by §a${round(this.level * mult, 1)}%`],
    };
  }

  get third() {
    const mult = getValue(this.rarity, { rare: 0.5, epic: 1 });

    return {
      name: "§6Kuudra Fortune",
      desc: [
        `§7Gain §6+${round(this.level * mult, 1)} ${symbols.mining_fortune.symbol} Mining Fortune §7while on the Crimson Isle`,
      ],
    };
  }

  get fourth() {
    const mult = getValue(this.rarity, { epic: 0.2 });

    return {
      name: "§6Trophy Bait",
      desc: [`§7Increases the odds of fishing Trophy Fish by §a${round(this.level * mult, 1)}%`],
    };
  }

  get fifth() {
    return {
      name: "§6Kuudra Specialist",
      desc: [`§7Increases all damage to Kuudra by §c5%`],
    };
  }
}

class QuestionMark extends Pet {
  get stats() {
    return {};
  }

  get abilities() {
    const list = [this.first];
    if (this.rarity >= RARE) {
      list.push(this.second);
    }
    if (this.rarity >= LEGENDARY) {
      list.push(this.third);
    }
    return list;
  }

  get first() {
    return {
      name: "§6???",
      desc: [`§7???`],
    };
  }

  get second() {
    return {
      name: "§6???",
      desc: [`§7???`],
    };
  }

  get third() {
    return {
      name: "§6???",
      desc: [`§7???`],
    };
  }
}

const petStats = {
  "???": QuestionMark,
  AMMONITE: Ammonite,
  ARMADILLO: Armadillo,
  BABY_YETI: BabyYeti,
  BAL: Bal,
  BAT: Bat,
  BEE: Bee,
  BINGO: Bingo,
  BLACK_CAT: BlackCat,
  BLAZE: Blaze,
  BLUE_WHALE: BlueWhale,
  CHICKEN: Chicken,
  DOLPHIN: Dolphin,
  DROPLET_WISP: Wisp,
  FROST_WISP: Wisp,
  GLACIAL_WISP: Wisp,
  SUBZERO_WISP: Wisp,
  ELEPHANT: Elephant,
  ENDER_DRAGON: EnderDragon,
  ENDERMAN: Enderman,
  ENDERMITE: Endermite,
  FLYING_FISH: FlyingFish,
  GHOUL: Ghoul,
  GIRAFFE: Giraffe,
  GOLDEN_DRAGON: GoldenDragon,
  GOLEM: Golem,
  GRANDMA_WOLF: GrandmaWolf,
  GRIFFIN: Griffin,
  GUARDIAN: Guardian,
  HORSE: Horse,
  HOUND: Hound,
  JELLYFISH: Jellyfish,
  JERRY: Jerry,
  KUUDRA: Kuudra,
  LION: Lion,
  MAGMA_CUBE: MagmaCube,
  MEGALODON: Megalodon,
  MITHRIL_GOLEM: MithrilGolem,
  MONKEY: Monkey,
  MOOSHROOM_COW: MooshroomCow,
  OCELOT: Ocelot,
  PARROT: Parrot,
  PHOENIX: Phoenix,
  PIG: Pig,
  PIGMAN: Pigman,
  RABBIT: Rabbit,
  RAT: Rat,
  ROCK: Rock,
  SCATHA: Scatha,
  SHEEP: Sheep,
  SILVERFISH: Silverfish,
  SKELETON_HORSE: SkeletonHorse,
  SKELETON: Skeleton,
  SNAIL: Snail,
  SNOWMAN: Snowman,
  SPIDER: Spider,
  SPIRIT: Spirit,
  SQUID: Squid,
  TARANTULA: Tarantula,
  TIGER: Tiger,
  TURTLE: Turtle,
  WITHER_SKELETON: WitherSkeleton,
  WOLF: Wolf,
  ZOMBIE: Zombie,
};

const pet_rarity_offset = {
    common: 0,
    uncommon: 6,
    rare: 11,
    epic: 16,
    legendary: 20,
    mythic: 20,
  };

  const pet_levels = [
    100, 110, 120, 130, 145, 160, 175, 190, 210, 230, 250, 275, 300, 330, 360, 400, 440, 490, 540, 600, 660, 730, 800,
    880, 960, 1050, 1150, 1260, 1380, 1510, 1650, 1800, 1960, 2130, 2310, 2500, 2700, 2920, 3160, 3420, 3700, 4000, 4350,
    4750, 5200, 5700, 6300, 7000, 7800, 8700, 9700, 10800, 12000, 13300, 14700, 16200, 17800, 19500, 21300, 23200, 25200,
    27400, 29800, 32400, 35200, 38200, 41400, 44800, 48400, 52200, 56200, 60400, 64800, 69400, 74200, 79200, 84700, 90700,
    97200, 104200, 111700, 119700, 128200, 137200, 146700, 156700, 167700, 179700, 192700, 206700, 221700, 237700, 254700,
    272700, 291700, 311700, 333700, 357700, 383700, 411700, 441700, 476700, 516700, 561700, 611700, 666700, 726700,
    791700, 861700, 936700, 1016700, 1101700, 1191700, 1286700, 1386700, 1496700, 1616700, 1746700, 1886700, 0, 5555,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
  ];

  const pet_data = {
    ARMADILLO: {
      head: "/head/c1eb6df4736ae24dd12a3d00f91e6e3aa7ade6bbefb0978afef2f0f92461018f",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
      category: "Mount",
    },
    BAT: {
      head: "/head/382fc3f71b41769376a9e92fe3adbaac3772b999b219c9d6b4680ba9983e527",
      type: "mining",
      maxTier: "mythic",
      maxLevel: 100,
    },
    BLAZE: {
      head: "/head/b78ef2e4cf2c41a2d14bfde9caff10219f5b1bf5b35a49eb51c6467882cb5f0",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    CHICKEN: {
      head: "/head/7f37d524c3eed171ce149887ea1dee4ed399904727d521865688ece3bac75e",
      type: "farming",
      maxTier: "legendary",
      maxLevel: 100,
    },
    HORSE: {
      head: "/head/36fcd3ec3bc84bafb4123ea479471f9d2f42d8fb9c5f11cf5f4e0d93226",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      category: "Mount",
    },
    JERRY: {
      head: "/head/822d8e751c8f2fd4c8942c44bdb2f5ca4d8ae8e575ed3eb34c18a86e93b",
      type: "combat",
      maxTier: "mythic",
      maxLevel: 100,
    },
    OCELOT: {
      head: "/head/5657cd5c2989ff97570fec4ddcdc6926a68a3393250c1be1f0b114a1db1",
      type: "foraging",
      maxTier: "legendary",
      maxLevel: 100,
    },
    PIGMAN: {
      head: "/head/63d9cb6513f2072e5d4e426d70a5557bc398554c880d4e7b7ec8ef4945eb02f2",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    RABBIT: {
      head: "/head/117bffc1972acd7f3b4a8f43b5b6c7534695b8fd62677e0306b2831574b",
      type: "farming",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SHEEP: {
      head: "/head/64e22a46047d272e89a1cfa13e9734b7e12827e235c2012c1a95962874da0",
      type: "alchemy",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SILVERFISH: {
      head: "/head/da91dab8391af5fda54acd2c0b18fbd819b865e1a8f1d623813fa761e924540",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
    },
    WITHER_SKELETON: {
      head: "/head/f5ec964645a8efac76be2f160d7c9956362f32b6517390c59c3085034f050cff",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SKELETON_HORSE: {
      head: "/head/47effce35132c86ff72bcae77dfbb1d22587e94df3cbc2570ed17cf8973a",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      category: "Mount",
    },
    WOLF: {
      head: "/head/dc3dd984bb659849bd52994046964c22725f717e986b12d548fd169367d494",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    ENDERMAN: {
      head: "/head/6eab75eaa5c9f2c43a0d23cfdce35f4df632e9815001850377385f7b2f039ce1",
      type: "combat",
      maxTier: "mythic",
      maxLevel: 100,
    },
    PHOENIX: {
      head: "/head/23aaf7b1a778949696cb99d4f04ad1aa518ceee256c72e5ed65bfa5c2d88d9e",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    MAGMA_CUBE: {
      head: "/head/38957d5023c937c4c41aa2412d43410bda23cf79a9f6ab36b76fef2d7c429",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    FLYING_FISH: {
      head: {
        default: "/head/40cd71fbbbbb66c7baf7881f415c64fa84f6504958a57ccdb8589252647ea",
        mythic: "/head/b0e2363c2d41a9d323ba625de8c0637063a36fe85a045de275a7b7739ded6051",
      },
      type: "fishing",
      maxTier: "mythic",
      maxLevel: 100,
    },
    BLUE_WHALE: {
      head: "/head/dab779bbccc849f88273d844e8ca2f3a67a1699cb216c0a11b44326ce2cc20",
      type: "fishing",
      maxTier: "legendary",
      maxLevel: 100,
    },
    TIGER: {
      head: "/head/fc42638744922b5fcf62cd9bf27eeab91b2e72d6c70e86cc5aa3883993e9d84",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    LION: {
      head: "/head/38ff473bd52b4db2c06f1ac87fe1367bce7574fac330ffac7956229f82efba1",
      type: "foraging",
      maxTier: "legendary",
      maxLevel: 100,
    },
    PARROT: {
      head: "/head/5df4b3401a4d06ad66ac8b5c4d189618ae617f9c143071c8ac39a563cf4e4208",
      type: "alchemy",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SNOWMAN: {
      head: "/head/11136616d8c4a87a54ce78a97b551610c2b2c8f6d410bc38b858f974b113b208",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    TURTLE: {
      head: "/head/212b58c841b394863dbcc54de1c2ad2648af8f03e648988c1f9cef0bc20ee23c",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    BEE: {
      head: "/head/7e941987e825a24ea7baafab9819344b6c247c75c54a691987cd296bc163c263",
      type: "farming",
      maxTier: "legendary",
      maxLevel: 100,
    },
    ENDER_DRAGON: {
      head: "/head/aec3ff563290b13ff3bcc36898af7eaa988b6cc18dc254147f58374afe9b21b9",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    GUARDIAN: {
      head: "/head/221025434045bda7025b3e514b316a4b770c6faa4ba9adb4be3809526db77f9d",
      type: "enchanting",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SQUID: {
      head: "/head/01433be242366af126da434b8735df1eb5b3cb2cede39145974e9c483607bac",
      type: "fishing",
      maxTier: "legendary",
      maxLevel: 100,
    },
    GIRAFFE: {
      head: "/head/176b4e390f2ecdb8a78dc611789ca0af1e7e09229319c3a7aa8209b63b9",
      type: "foraging",
      maxTier: "legendary",
      maxLevel: 100,
    },
    ELEPHANT: {
      head: "/head/7071a76f669db5ed6d32b48bb2dba55d5317d7f45225cb3267ec435cfa514",
      type: "farming",
      maxTier: "legendary",
      maxLevel: 100,
    },
    MONKEY: {
      head: "/head/13cf8db84807c471d7c6922302261ac1b5a179f96d1191156ecf3e1b1d3ca",
      type: "foraging",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SPIDER: {
      head: "/head/cd541541daaff50896cd258bdbdd4cf80c3ba816735726078bfe393927e57f1",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    ENDERMITE: {
      head: "/head/5a1a0831aa03afb4212adcbb24e5dfaa7f476a1173fce259ef75a85855",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
    },
    GHOUL: {
      head: "/head/87934565bf522f6f4726cdfe127137be11d37c310db34d8c70253392b5ff5b",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    JELLYFISH: {
      head: "/head/913f086ccb56323f238ba3489ff2a1a34c0fdceeafc483acff0e5488cfd6c2f1",
      type: "alchemy",
      maxTier: "legendary",
      maxLevel: 100,
    },
    PIG: {
      head: "/head/621668ef7cb79dd9c22ce3d1f3f4cb6e2559893b6df4a469514e667c16aa4",
      type: "farming",
      maxTier: "legendary",
      maxLevel: 100,
      category: "Mount",
    },
    ROCK: {
      head: "/head/cb2b5d48e57577563aca31735519cb622219bc058b1f34648b67b8e71bc0fa",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
      category: "Mount",
    },
    SKELETON: {
      head: "/head/fca445749251bdd898fb83f667844e38a1dff79a1529f79a42447a0599310ea4",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    ZOMBIE: {
      head: "/head/56fc854bb84cf4b7697297973e02b79bc10698460b51a639c60e5e417734e11",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    DOLPHIN: {
      head: "/head/cefe7d803a45aa2af1993df2544a28df849a762663719bfefc58bf389ab7f5",
      type: "fishing",
      maxTier: "legendary",
      maxLevel: 100,
    },
    BABY_YETI: {
      head: "/head/ab126814fc3fa846dad934c349628a7a1de5b415021a03ef4211d62514d5",
      type: "fishing",
      maxTier: "legendary",
      maxLevel: 100,
    },
    MEGALODON: {
      head: "/head/a94ae433b301c7fb7c68cba625b0bd36b0b14190f20e34a7c8ee0d9de06d53b9",
      type: "fishing",
      maxTier: "legendary",
      maxLevel: 100,
    },
    GOLEM: {
      head: "/head/89091d79ea0f59ef7ef94d7bba6e5f17f2f7d4572c44f90f76c4819a714",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    HOUND: {
      head: "/head/b7c8bef6beb77e29af8627ecdc38d86aa2fea7ccd163dc73c00f9f258f9a1457",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    TARANTULA: {
      head: "/head/8300986ed0a04ea79904f6ae53f49ed3a0ff5b1df62bba622ecbd3777f156df8",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    BLACK_CAT: {
      head: "/head/e4b45cbaa19fe3d68c856cd3846c03b5f59de81a480eec921ab4fa3cd81317",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SPIRIT: {
      head: "/head/8d9ccc670677d0cebaad4058d6aaf9acfab09abea5d86379a059902f2fe22655",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      passivePerks: true,
    },
    GRIFFIN: {
      head: "/head/4c27e3cb52a64968e60c861ef1ab84e0a0cb5f07be103ac78da67761731f00c8",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      ignoresTierBoost: true,
    },
    MITHRIL_GOLEM: {
      head: "/head/c1b2dfe8ed5dffc5b1687bc1c249c39de2d8a6c3d90305c95f6d1a1a330a0b1",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
    },
    GRANDMA_WOLF: {
      head: "/head/4e794274c1bb197ad306540286a7aa952974f5661bccf2b725424f6ed79c7884",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      passivePerks: true,
    },
    RAT: {
      head: "/head/a8abb471db0ab78703011979dc8b40798a941f3a4dec3ec61cbeec2af8cffe8",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      category: "Morph",
    },
    BAL: {
      head: "/head/c469ba2047122e0a2de3c7437ad3dd5d31f1ac2d27abde9f8841e1d92a8c5b75",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SCATHA: {
      head: "/head/df03ad96092f3f789902436709cdf69de6b727c121b3c2daef9ffa1ccaed186c",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
    },
    GOLDEN_DRAGON: {
      head: "/head/2e9f9b1fc014166cb46a093e5349b2bf6edd201b680d62e48dbf3af9b0459116",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 200,
      hatching: {
        level: 100,
        name: "Golden Dragon Egg",
        head: "/head/113bdf2d2b00605606826df76e211ea288aa050edc9d71cb09986c488ca0411c",
      },
    },
    AMMONITE: {
      head: "/head/a074a7bd976fe6aba1624161793be547d54c835cf422243a851ba09d1e650553",
      type: "fishing",
      maxTier: "legendary",
      maxLevel: 100,
    },
    BINGO: {
      head: "/head/d4cd9c707c7092d4759fe2b2b6a713215b6e39919ec4e7afb1ae2b6f8576674c",
      type: "all",
      maxTier: "epic",
      maxLevel: 100,
      passivePerks: true,
      bingoExclusive: true,
      customLevelExpRarityOffset: "common",
    },
    MOOSHROOM_COW: {
      head: "/head/2b52841f2fd589e0bc84cbabf9e1c27cb70cac98f8d6b3dd065e55a4dcb70d77",
      type: "farming",
      maxTier: "legendary",
      maxLevel: 100,
    },
    SNAIL: {
      head: "/head/50a9933a3b10489d38f6950c4e628bfcf9f7a27f8d84666f04f14d5374252972",
      type: "mining",
      maxTier: "legendary",
      maxLevel: 100,
    },
    KUUDRA: {
      head: "/head/1f0239fb498e5907ede12ab32629ee95f0064574a9ffdff9fc3a1c8e2ec17587",
      type: "combat",
      maxTier: "legendary",
      maxLevel: 100,
      passivePerks: true,
      alwaysGainsExp: "§cCrimson Isle",
    },
    DROPLET_WISP: {
      head: "/head/b412e70375ec99ee38ae94b30e9b10752d459662b54794dfe66fe6a183c672d3",
      type: "gabagool",
      maxTier: "uncommon",
      maxLevel: 100,
      obtainsExp: "feed",
      ignoresTierBoost: true,
      typeGroup: "WISP",
    },
    FROST_WISP: {
      head: "/head/1d8ad9936d758c5ea30b0b7cc7c67c2bfcea829ecf2425c0b50fc92a26ae23d0",
      type: "gabagool",
      maxTier: "rare",
      maxLevel: 100,
      obtainsExp: "feed",
      ignoresTierBoost: true,
      typeGroup: "WISP",
    },
    GLACIAL_WISP: {
      head: "/head/3e2018feebe1a99177b3cb196d4e44521268b4b3eb56e6419cb0253cdbf0456c",
      type: "gabagool",
      maxTier: "epic",
      maxLevel: 100,
      obtainsExp: "feed",
      ignoresTierBoost: true,
      typeGroup: "WISP",
    },
    SUBZERO_WISP: {
      head: "/head/7a0eb37e58c942eca4d33ab44e26eb1910c783788510b0a53b6f4d18881e237e",
      type: "gabagool",
      maxTier: "legendary",
      maxLevel: 100,
      obtainsExp: "feed",
      ignoresTierBoost: true,
      typeGroup: "WISP",
    },
};

const pet_value = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythic: 6,
};

const COMMON = rarities.indexOf("common");
const UNCOMMON = rarities.indexOf("uncommon");
const RARE = rarities.indexOf("rare");
const EPIC = rarities.indexOf("epic");
const LEGENDARY = rarities.indexOf("legendary");
const MYTHIC = rarities.indexOf("mythic");

const pet_items = {
    PET_ITEM_ALL_SKILLS_BOOST_COMMON: {
      name: "All Skills Exp Boost",
      tier: "COMMON",
      description: "§7Gives +§a10% §7pet exp for all skills",
    },
    PET_ITEM_BIG_TEETH_COMMON: {
      name: "Big Teeth",
      tier: "COMMON",
      description: `§7Increases §9${symbols.crit_chance.symbol} Crit Chance §7by §a5`,
      stats: {
        crit_chance: 5,
      },
    },
    PET_ITEM_IRON_CLAWS_COMMON: {
      name: "Iron Claws",
      tier: "COMMON",
      description: `§7Increases the pet's §9${symbols.crit_damage.symbol} Crit Damage §7by §a40% §7and §9${symbols.crit_chance.symbol} Crit Chance §7by §a40%`,
      multStats: {
        crit_chance: 1.4,
        crit_damage: 1.4,
      },
    },
    PET_ITEM_SHARPENED_CLAWS_UNCOMMON: {
      name: "Sharpened Claws",
      tier: "UNCOMMON",
      description: `§7Increases §9${symbols.crit_damage.symbol} Crit Damage §7by §a15`,
      stats: {
        crit_damage: 15,
      },
    },
    PET_ITEM_HARDENED_SCALES_UNCOMMON: {
      name: "Hardened Scales",
      tier: "UNCOMMON",
      description: `§7Increases §a${symbols.defense.symbol} Defense §7by §a25`,
      stats: {
        defense: 25,
      },
    },
    PET_ITEM_BUBBLEGUM: {
      name: "Bubblegum",
      tier: "RARE",
      description: "§7Your pet fuses its power with placed §aOrbs §7to give them §a2x §7duration",
    },
    PET_ITEM_LUCKY_CLOVER: {
      name: "Lucky Clover",
      tier: "EPIC",
      description: `§7Increases §b${symbols.magic_find.symbol} Magic Find §7by §a7`,
      stats: {
        magic_find: 7,
      },
    },
    PET_ITEM_TEXTBOOK: {
      name: "Textbook",
      tier: "LEGENDARY",
      description: `§7Increases the pet's §b${symbols.intelligence.symbol} Intelligence §7by §a100%`,
      multStats: {
        intelligence: 2,
      },
    },
    PET_ITEM_SADDLE: {
      name: "Saddle",
      tier: "UNCOMMON",
      description: "§7Increase horse speed by §a50% §7 and jump boost by §a100%",
    },
    PET_ITEM_EXP_SHARE: {
      name: "Exp Share",
      tier: "EPIC",
      description:
        "§7While unequipped this pet gains §a25% §7of the equipped pet's xp, this is §7split between all pets holding the item.",
    },
    PET_ITEM_TIER_BOOST: {
      name: "Tier Boost",
      tier: "LEGENDARY",
      description: "§7Boosts the §ararity §7of your pet by 1 tier!",
    },
    PET_ITEM_COMBAT_SKILL_BOOST_COMMON: {
      name: "Combat Exp Boost",
      tier: "COMMON",
      description: "§7Gives +§a20% §7pet exp for Combat",
    },
    PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON: {
      name: "Combat Exp Boost",
      tier: "UNCOMMON",
      description: "§7Gives +§a30% §7pet exp for Combat",
    },
    PET_ITEM_COMBAT_SKILL_BOOST_RARE: {
      name: "Combat Exp Boost",
      tier: "RARE",
      description: "§7Gives +§a40% §7pet exp for Combat",
    },
    PET_ITEM_COMBAT_SKILL_BOOST_EPIC: {
      name: "Combat Exp Boost",
      tier: "EPIC",
      description: "§7Gives +§a50% §7pet exp for Combat",
    },
    PET_ITEM_FISHING_SKILL_BOOST_COMMON: {
      name: "Fishing Exp Boost",
      tier: "COMMON",
      description: "§7Gives +§a20% §7pet exp for Fishing",
    },
    PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON: {
      name: "Fishing Exp Boost",
      tier: "UNCOMMON",
      description: "§7Gives +§a30% §7pet exp for Fishing",
    },
    PET_ITEM_FISHING_SKILL_BOOST_RARE: {
      name: "Fishing Exp Boost",
      tier: "RARE",
      description: "§7Gives +§a40% §7pet exp for Fishing",
    },
    PET_ITEM_FISHING_SKILL_BOOST_EPIC: {
      name: "Fishing Exp Boost",
      tier: "EPIC",
      description: "§7Gives +§a50% §7pet exp for Fishing",
    },
    PET_ITEM_FORAGING_SKILL_BOOST_COMMON: {
      name: "Foraging Exp Boost",
      tier: "COMMON",
      description: "§7Gives +§a20% §7pet exp for Foraging",
    },
    PET_ITEM_FORAGING_SKILL_BOOST_UNCOMMON: {
      name: "Foraging Exp Boost",
      tier: "UNCOMMON",
      description: "§7Gives +§a30% §7pet exp for Foraging",
    },
    PET_ITEM_FORAGING_SKILL_BOOST_RARE: {
      name: "Foraging Exp Boost",
      tier: "RARE",
      description: "§7Gives +§a40% §7pet exp for Foraging",
    },
    PET_ITEM_FORAGING_SKILL_BOOST_EPIC: {
      name: "Foraging Exp Boost",
      tier: "EPIC",
      description: "§7Gives +§a50% §7pet exp for Foraging",
    },
    PET_ITEM_MINING_SKILL_BOOST_COMMON: {
      name: "Mining Exp Boost",
      tier: "COMMON",
      description: "§7Gives +§a20% §7pet exp for Mining",
    },
    PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: {
      name: "Mining Exp Boost",
      tier: "UNCOMMON",
      description: "§7Gives +§a30% §7pet exp for Mining",
    },
    PET_ITEM_MINING_SKILL_BOOST_RARE: {
      name: "Mining Exp Boost",
      tier: "RARE",
      description: "§7Gives +§a40% §7pet exp for Mining",
    },
    PET_ITEM_MINING_SKILL_BOOST_EPIC: {
      name: "Mining Exp Boost",
      tier: "EPIC",
      description: "§7Gives +§a50% §7pet exp for Mining",
    },
    PET_ITEM_FARMING_SKILL_BOOST_COMMON: {
      name: "Farming Exp Boost",
      tier: "COMMON",
      description: "§7Gives +§a20% §7pet exp for Farming",
    },
    PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON: {
      name: "Farming Exp Boost",
      tier: "UNCOMMON",
      description: "§7Gives +§a30% §7pet exp for Farming",
    },
    PET_ITEM_FARMING_SKILL_BOOST_RARE: {
      name: "Farming Exp Boost",
      tier: "RARE",
      description: "§7Gives +§a40% §7pet exp for Farming",
    },
    PET_ITEM_FARMING_SKILL_BOOST_EPIC: {
      name: "Farming Exp Boost",
      tier: "EPIC",
      description: "§7Gives +§a50% §7pet exp for Farming",
    },
    REINFORCED_SCALES: {
      name: "Reinforced Scales",
      tier: "RARE",
      description: `§7Increases §a${symbols.defense.symbol} Defense §7by §a40`,
      stats: {
        defense: 40,
      },
    },
    GOLD_CLAWS: {
      name: "Gold Claws",
      tier: "UNCOMMON",
      description: `§7Increases the pet's §9${symbols.crit_damage.symbol} Crit Damage §7by §a50% §7and §9${symbols.crit_chance.symbol} Crit Chance §7by §a50%`,
      multStats: {
        crit_chance: 1.5,
        crit_damage: 1.5,
      },
    },
    ALL_SKILLS_SUPER_BOOST: {
      name: "All Skills Exp Super-Boost",
      tier: "COMMON",
      description: "§7Gives +§a20% §7pet exp for all skills",
    },
    BIGGER_TEETH: {
      name: "Bigger Teeth",
      tier: "UNCOMMON",
      description: `§7Increases §9${symbols.crit_chance.symbol} Crit Chance §7by §a10`,
      stats: {
        crit_chance: 10,
      },
    },
    SERRATED_CLAWS: {
      name: "Serrated Claws",
      tier: "RARE",
      description: `§7Increases §9${symbols.crit_damage.symbol} Crit Damage §7by §a25`,
      stats: {
        crit_damage: 25,
      },
    },
    WASHED_UP_SOUVENIR: {
      name: "Washed-up Souvenir",
      tier: "LEGENDARY",
      description: `§7Increases §3${symbols.sea_creature_chance.symbol} Sea Creature Chance §7by §a5`,
      stats: {
        sea_creature_chance: 5,
      },
    },
    ANTIQUE_REMEDIES: {
      name: "Antique Remedies",
      tier: "EPIC",
      description: `§7Increases the pet's §c${symbols.strength.symbol} Strength §7by §a80%`,
      multStats: {
        strength: 1.8,
      },
    },
    CROCHET_TIGER_PLUSHIE: {
      name: "Crochet Tiger Plushie",
      tier: "EPIC",
      description: `§7Increases §e${symbols.bonus_attack_speed.symbol} Bonus Attack Speed §7by §a35`,
      stats: {
        bonus_attack_speed: 35,
      },
    },
    DWARF_TURTLE_SHELMET: {
      name: "Dwarf Turtle Shelmet",
      tier: "RARE",
      description: `§7Makes the pet's owner immune to knockback.`,
    },
    PET_ITEM_VAMPIRE_FANG: {
      name: "Vampire Fang",
      tier: "LEGENDARY",
      description: "§7Upgrades a Bat pet from §6Legendary §7to §dMythic §7adding a bonus perk and bonus stats!",
    },
    PET_ITEM_SPOOKY_CUPCAKE: {
      name: "Spooky Cupcake",
      tier: "UNCOMMON",
      description: `§7Increases §c${symbols.strength.symbol} Strength §7by §a30 §7and §f${symbols.speed.symbol} Speed §7by §a20`,
      stats: {
        strength: 30,
        speed: 20,
      },
    },
    MINOS_RELIC: {
      name: "Minos Relic",
      tier: "EPIC",
      description: `§7Increases all pet stats by §a33.3%`,
      multAllStats: 1.333,
    },
    PET_ITEM_TOY_JERRY: {
      name: "Jerry 3D Glasses",
      tier: "LEGENDARY",
      description: "§7Upgrades a Jerry pet from §6Legendary §7to §dMythic §7and granting it a new perk!",
    },
    REAPER_GEM: {
      name: "Reaper Gem",
      tier: "LEGENDARY",
      description: `§7Gain §c8${symbols.ferocity.symbol} Ferocity §7for 5s on kill`,
    },
    PET_ITEM_FLYING_PIG: {
      name: "Flying Pig",
      tier: "UNCOMMON",
      description: `§7Grants your pig pet the ability to fly while on your private island! You also don't need to hold a carrot on a stick to control your pig.`,
    },
    PET_ITEM_QUICK_CLAW: {
      name: "Quick Claw",
      tier: "RARE",
      description: `§7Every 2 pet level you gain §6+1 ${symbols.mining_speed.symbol} Mining Speed §7and §6+1 §6${symbols.mining_fortune.symbol} Mining Fortune§7.`,
      statsPerLevel: {
        mining_speed: 0.5,
        mining_fortune: 0.5,
      },
    },
};


module.exports = {
    pet_rarity_offset,
    pet_levels,
    pet_data,
    pet_value,
    pet_items,
    rarityColors,
    petStats
}

  