const { bestiary, bestiaryKills } = require('../constants/bestiary.js');

module.exports = (profile) => {
    const result = {
        level: 0,
        categories: {},
    };

    let totalCollection = 0;
    const bestiaryFamilies = {};
    for (const [name, value] of Object.entries(profile.bestiary || {})) {
        if (name.startsWith('kills_family_')) {
            bestiaryFamilies[name] = value;
        }
    }

    for (const family of Object.keys(bestiary)) {
        result.categories[family] = {};
        for (const mob of bestiary[family].mobs) {
            const mobName = mob.lookup.substring(13);

            const boss = mob.boss ? 'boss' : 'regular';

            let kills = bestiaryFamilies[mob.lookup] || 0;
            let tier = bestiaryKills[boss].filter((k) => k <= kills).length;
            let nextTierKills = bestiaryKills[boss][tier];
            let progress = kills/bestiaryKills[boss][tier];
            let levelWithProgress = tier + (kills/bestiaryKills[boss][tier]);
            let toTier = bestiaryKills[boss][tier] - (kills || 0);

            if (tier >= bestiary[family].max) {
                tier = bestiary[family].max;
                // setting all data to null since bestiary family is maxed
                nextTierKills = null;
                toTier = null;
                progress = 0;
                levelWithProgress = tier;
            }
            totalCollection += tier;

            result.categories[family][mobName] = {
                tier: tier, 
                nextTier: nextTierKills,
                kills: kills,
                killsForNext: toTier,
                progress: progress,
                levelWithProgress: levelWithProgress,
            };
        }
    }

    result.level = totalCollection / 10;

    return result;
};
