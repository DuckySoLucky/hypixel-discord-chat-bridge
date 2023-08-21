const constants = require("../constants/bestiary.js");

function formatBestiaryMobs(userProfile, mobs) {
  const output = [];
  for (const mob of mobs) {
    const mobBracket = constants.BESTIARY_BRACKETS[mob.bracket];

    const totalKills = mob.mobs.reduce((acc, cur) => {
      return acc + (userProfile.bestiary.kills[cur] ?? 0);
    }, 0);

    const maxKills = mob.cap;
    const nextTierKills = mobBracket.find((tier) => totalKills < tier && tier <= maxKills);
    const tier = nextTierKills ? mobBracket.indexOf(nextTierKills) : mobBracket.indexOf(maxKills) + 1;

    output.push({
      name: mob.name,
      kills: totalKills,
      nextTierKills: nextTierKills ?? null,
      maxKills: maxKills,
      tier: tier,
      maxTier: mobBracket.indexOf(maxKills) + 1,
    });
  }

  return output;
}

function getBestiary(userProfile) {
  try {
    if (userProfile.bestiary?.kills === undefined) {
      return null;
    }

    const output = {};
    let tiersUnlocked = 0,
      totalTiers = 0;
    for (const [category, data] of Object.entries(constants.BESTIARY)) {
      const { name, mobs } = data;
      output[category] = { name };

      if (category === "fishing") {
        for (const [key, value] of Object.entries(data)) {
          if (key === "name") continue;

          output[category][key] = {
            name: value.name,
          };

          output[category][key].mobs = formatBestiaryMobs(userProfile, value.mobs);

          tiersUnlocked += output[category][key].mobs.reduce((acc, cur) => acc + cur.tier, 0);
          totalTiers += output[category][key].mobs.reduce((acc, cur) => acc + cur.maxTier, 0);
          output[category][key].mobsUnlocked = output[category][key].mobs.length;
          output[category][key].mobsMaxed = output[category][key].mobs.filter((mob) => mob.tier === mob.maxTier).length;
        }
      } else {
        output[category].mobs = formatBestiaryMobs(userProfile, mobs);
        output[category].mobsUnlocked = output[category].mobs.length;
        output[category].mobsMaxed = output[category].mobs.filter((mob) => mob.tier === mob.maxTier).length;

        tiersUnlocked += output[category].mobs.reduce((acc, cur) => acc + cur.tier, 0);
        totalTiers += output[category].mobs.reduce((acc, cur) => acc + cur.maxTier, 0);
      }
    }

    return {
      categories: output,
      tiersUnlocked,
      totalTiers,
      milestone: tiersUnlocked / 10,
      maxMilestone: totalTiers / 10,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getBestiary,
};
