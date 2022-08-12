const milestones = require('../constants/milestones')

module.exports = function getMilestones(profile) {

    const dolphin = getCurrentPet('dolphin', profile.stats.pet_milestone_sea_creatures_killed || 0)
    const rock = getCurrentPet('rock', profile.stats.pet_milestone_ores_mined || 0)

    return {
        fishing: {
            current_pet: milestones.rarities[dolphin.level-1],
            next_pet: dolphin.xpForNext,
            sea_creatures_killed: dolphin.stats,
            nextRarity: dolphin.left,   
            progress: dolphin.progress
        },
        mining: {
            current_pet: milestones.rarities[rock.level-1],
            next_pet: rock.xpForNext,
            ores_mined: rock.stats,
            nextRarity: rock.left,
            progress: rock.progress
        }
    }
}

//CREDIT: https://github.com/SkyCrypt/SkyCryptWebsite (Modified)
function getCurrentPet(pet, stats) {
    let level = 0;
    let xpForNext = 0;
    let progress = 0;

    for (let i = 0; i < 5; i++) {
        if (milestones[pet][i] < stats) level = i + 1;
    }

    if (level < 5) {
        xpForNext = Math.ceil(milestones[pet][level])
    }

    let left = xpForNext - stats

    progress = level >= 5 ? 0 : Math.max(0, Math.min(stats / xpForNext, 1));
    return {
        stats,
        left,
        level,
        xpForNext, 
        progress
    }
}