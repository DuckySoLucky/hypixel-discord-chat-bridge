//CREDIT: https://github.com/Senither/hypixel-skyblock-facade
const dungeon_weights = {
    catacombs: 0.0002149604615,
    healer: 0.0000045254834,
    mage: 0.0000045254834,
    berserk: 0.0000045254834,
    archer: 0.0000045254834,
    tank: 0.0000045254834,
}
const slayer_weights = {
    revenant: {
        divider: 2208,
        modifier: 0.15,
    },
    tarantula: {
        divider: 2118,
        modifier: 0.08,
    },
    sven: {
        divider: 1962,
        modifier: 0.015,
    },
    enderman: {
        divider: 1430,
        modifier: .017,
    }
}
const skill_weights = {
    mining: {
        exponent: 1.18207448,
        divider: 259634,
        maxLevel: 60,
    },
    // Maxes out foraging at 850 points at level 50.
    foraging: {
        exponent: 1.232826,
        divider: 259634,
        maxLevel: 50,
    },
    // Maxes out enchanting at 450 points at level 60.
    enchanting: {
        exponent: 0.96976583,
        divider: 882758,
        maxLevel: 60,
    },
    // Maxes out farming at 2,200 points at level 60.
    farming: {
        exponent: 1.217848139,
        divider: 220689,
        maxLevel: 60,
    },
    // Maxes out combat at 1,500 points at level 60.
    combat: {
        exponent: 1.15797687265,
        divider: 275862,
        maxLevel: 60,
    },
    // Maxes out fishing at 2,500 points at level 50.
    fishing: {
        exponent: 1.406418,
        divider: 88274,
        maxLevel: 50,
    },
    // Maxes out alchemy at 200 points at level 50.
    alchemy: {
        exponent: 1.0,
        divider: 1103448,
        maxLevel: 50,
    },
    // Maxes out taming at 500 points at level 50.
    taming: {
        exponent: 1.14744,
        divider: 441379,
        maxLevel: 50,
    }
}


module.exports = function calculateWeight(type, level = null, experience) {
    const slayers = ['revenant', 'tarantula', 'sven', 'enderman']
    const dungeons = ['catacombs', 'healer', 'mage', 'berserk', 'archer', 'tank']
    const skills = ['mining', 'foraging', 'enchanting', 'farming', 'combat', 'fishing', 'alchemy', 'taming']
    if (slayers.includes(type)) return calculateSlayerWeight(type, experience)
    else if (dungeons.includes(type)) return calculateDungeonWeight(type, level, experience)
    else if (skills.includes(type)) return calculateSkillWeight(type, level, experience)
    else return null
}

function calculateDungeonWeight(type, level, experience) {
    let percentageModifier = dungeon_weights[type]

    let base = Math.pow(level, 4.5) * percentageModifier

    if (experience <= 569809640) {
        return {
            weight: base,
            weight_overflow: 0,
        }
    }

    let remaining = experience - 569809640
    let splitter = (4 * 569809640) / base

    return {
        weight: Math.floor(base),
        weight_overflow: Math.pow(remaining / splitter, 0.968) || 0,
    }
}

function calculateSkillWeight(type, level, experience) {
    const skillGroup = skill_weights[type]
    if (skillGroup.exponent == undefined || skillGroup.divider == undefined) {
        return {
            weight: 0,
            weight_overflow: 0,
        }
    }

    let maxSkillLevelXP = skillGroup.maxLevel == 60 ? 111672425 : 55172425

    let base = Math.pow(level * 10, 0.5 + skillGroup.exponent + level / 100) / 1250
    if (experience > maxSkillLevelXP) {
        base = Math.round(base)
    }
    if (experience <= maxSkillLevelXP) {
        return {
            weight: base,
            weight_overflow: 0,
        }
    }

    return {
        weight: base,
        weight_overflow: Math.pow((experience - maxSkillLevelXP) / skillGroup.divider, 0.968),
    }
}

function calculateSlayerWeight(type, experience) {
    const slayerWeight = slayer_weights[type]

    if (experience <= 1000000) {
        return {
            weight: experience == 0 ? 0 : experience / slayerWeight.divider,
            weight_overflow: 0,
        }
    }

    let base = 1000000 / slayerWeight.divider
    let remaining = experience - 1000000

    let modifier = slayerWeight.modifier
    let overflow = 0

    while (remaining > 0) {
        let left = Math.min(remaining, 1000000)

        overflow += Math.pow(left / (slayerWeight.divider * (1.5 + modifier)), 0.942)
        modifier += slayerWeight.modifier
        remaining -= left
    }

    return {
        weight: base,
        weight_overflow: overflow,
    }
}