const xp_tables = require('../constants/xp_tables');

module.exports = (profile) => {
    function getSlayer(slayer) {
        const slayers = profile?.slayer_bosses?.[slayer];
        const experience = slayers?.xp || 0;
        if (experience <= 0) {
            return {
                xp: 0,
                level: 0,
                xpForNext: xp_tables.slayer[slayer][0],
                progress: 0,
                kills: {},
            };
        }

        let level = 0;
        let xpForNext = 0;
        let progress = 0;
        let maxLevel = 9;

        for (let i = 0; i < xp_tables.slayer[slayer].length; i++) {
            if (xp_tables.slayer[slayer][i] <= experience) {
                level = i + 1;
            }
        }

        if (level < maxLevel) {
            xpForNext = Math.ceil(xp_tables.slayer[slayer][level]);
        }

        progress = level >= maxLevel ? 0 : Math.max(0, Math.min(experience / xpForNext, 1));

        const kills = {};
        let total = 0;
        if (slayer === 'zombie') kills[5] = 0;
        for (let i = 0; i < Object.keys(slayers).length; i++) {
            if (Object.keys(slayers)[i].startsWith('boss_kills_tier_')) {
                // This indeed looks pretty bad I know... (kills[boss tier number])
                total += Object.values(slayers)[i];
                kills[Number(Object.keys(slayers)[i].charAt(Object.keys(slayers)[i].length - 1)) + 1] = Object.values(slayers)[i];
            }
        }

        return {
            xp: experience,
            totalKills: total,
            level,
            xpForNext,
            progress,
            kills,
        };
    }

    return {
        zombie: getSlayer('zombie'),
        spider: getSlayer('spider'),
        wolf: getSlayer('wolf'),
        enderman: getSlayer('enderman'),
        blaze: getSlayer('blaze'),
    };
};
