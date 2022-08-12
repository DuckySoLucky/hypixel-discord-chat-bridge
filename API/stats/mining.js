const { getHotM, perks, forgeItemTimes } = require('../constants/mining');
const { toFixed, titleCase } = require('../constants/functions');
const getSkills = require('./skills');

module.exports = (player, profile) => {
    const mining_stats = profile?.mining_core;
    const player_perks = [];
    const disabled_perks = [];

    for (const perk in Object.keys(mining_stats?.nodes || {}) || []) {
        if (!Object.keys(mining_stats.nodes)[perk].startsWith('toggle_')) {
            const currentPerk = perks[Object.keys(mining_stats.nodes)[perk]];
            player_perks.push({ name: currentPerk.name, id: currentPerk.id, level: Object.values(mining_stats.nodes)[perk], maxLevel: currentPerk.max });
        } else {
            disabled_perks.push(Object.keys(mining_stats.nodes)[perk].substring(7));
        }
    }

    for (let statue of mining_stats?.biomes?.dwarven?.statues_placed || []) {
        statue = titleCase(statue);
    }

    for (let part of mining_stats?.biomes?.precursor?.parts_delivered || []) {
        part = titleCase(part, true);
    }

    //Check if player has the "Quick Forge" perk in the Heart of the Mountain and change the duration of the items in the forge accordingly
    if (mining_stats?.nodes?.quick_forge) {
        for (const item of Object.keys(forgeItemTimes)) {
            const lessForgingTime = miningapi.mining_core.nodes.forge_time <= 19 ? 0.1 + miningapi.mining_core.nodes.forge_time * 0.005 : 0.3;
            forgeItemTimes[item].duration = forgeItemTimes[item].duration - forgeItemTimes[item].duration * lessForgingTime;
        }
    }

    //Forge Display
    const forge_api = profile.forge?.forge_processes || [];
    const forge = [];

    for (const forge_types of Object.values(forge_api)) {
        for (const item of Object.values(forge_types)) {
            if (item?.id === 'PET') item.id = 'AMMONITE';
            forge.push({
                slot: item.slot,
                item: forgeItemTimes[item.id]?.name || 'Unknown',
                id: item.id === 'AMMONITE' ? 'PET' : item.id,
                ending: Number((item.startTime + forgeItemTimes[item.id]?.duration || 0).toFixed()),
                ended: item.startTime + forgeItemTimes[item.id]?.duration || 0 < Date.now() ? true : false,
            });
        }
    }

    return {
        mining: getSkills(player, profile).mining?.level || 0,
        mithril_powder: { current: mining_stats?.powder_mithril_total || 0, total: (mining_stats?.powder_mithril_total || 0) + (mining_stats?.powder_spent_mithril || 0) },
        gemstone_powder: { current: mining_stats?.powder_gemstone_total || 0, total: (mining_stats?.powder_gemstone_total || 0) + (mining_stats?.powder_spent_gemstone || 0) },
        hotM_tree: {
            tokens: { current: mining_stats?.tokens || 0, total: mining_stats?.tokens || 0 + mining_stats?.tokens_spent || 0 },
            level: mining_stats?.experience ? Number(toFixed(getHotM(mining_stats?.experience))) : 0,
            perks: player_perks,
            disabled_perks: disabled_perks,
            last_reset: mining_stats?.last_reset || null,
            pickaxe_ability: perks[mining_stats?.selected_pickaxe_ability]?.name || null,
        },
        crystal_hollows: {
            last_pass: mining_stats?.greater_mines_last_access || null,
            crystals: [
                {
                    name: 'Jade Crystal',
                    id: 'jade_crystal',
                    total_placed: mining_stats?.crystals?.jade_crystal?.total_placed || 0,
                    statues_placed: mining_stats?.biomes?.dwarven?.statues_placed || [],
                    state: titleCase(mining_stats?.crystals?.jade_crystal?.state || 'Not Found', true),
                },
                {
                    name: 'Amber Crystal',
                    total_placed: mining_stats?.crystals?.amber_crystal?.total_placed || 0,
                    king_quests_completed: mining_stats?.biomes?.goblin?.king_quests_completed || 0,
                    state: titleCase(mining_stats?.crystals?.amber_crystal?.state || 'Not Found', true),
                },
                {
                    name: 'Sapphire Crystal',
                    total_placed: mining_stats?.crystals?.sapphire_crystal?.total_placed || 0,
                    parts_delivered: mining_stats?.biomes?.precursor?.parts_delivered || [],
                    state: titleCase(mining_stats?.crystals?.sapphire_crystal?.state || 'Not Found', true),
                },
                {
                    name: 'Amethyst Crystal',
                    total_placed: mining_stats?.crystals?.amethyst_crystal?.total_placed || 0,
                    state: titleCase(mining_stats?.crystals?.amethyst_crystal?.state || 'Not Found', true),
                },
                {
                    name: 'Topaz Crystal',
                    total_placed: mining_stats?.crystals?.topaz_crystal?.total_placed || 0,
                    state: titleCase(mining_stats?.crystals?.topaz_crystal?.state || 'Not Found', true),
                },
                {
                    name: 'Jasper Crystal',
                    total_placed: mining_stats?.crystals?.jasper_crystal?.total_placed || 0,
                    state: titleCase(mining_stats?.crystals?.jasper_crystal?.state || 'Not Found', true),
                },
                {
                    name: 'Ruby Crystal',
                    total_placed: mining_stats?.crystals?.ruby_crystal?.total_placed || 0,
                    state: titleCase(mining_stats?.crystals?.ruby_crystal?.state || 'Not Found', true),
                },
            ],
        },
        forge,
    };
};
