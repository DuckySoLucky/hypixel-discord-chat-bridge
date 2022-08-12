const { allTrophyFish } = require('../constants/trophyFishing.js');

module.exports = async (profile) => {
    if (profile.trophy_fish) {
        const trophyFish = {
            total_caught: 0,
            rewards: [],
            fish: allTrophyFish,
        };
        trophyFish.rewards = profile.trophy_fish.rewards
        trophyFish.total_caught = profile.trophy_fish.total_caught
        Object.keys(profile.trophy_fish).forEach((key) => {
            if (key == 'rewards' || key == 'total_caught') return;
            trophyFish.fish[key.toUpperCase()] = profile.trophy_fish[key]
        })

        return trophyFish;

    } else {
        return {
            rewards: [],
            total_caught: 0,
            fish: allTrophyFish,
        };
    }
};
