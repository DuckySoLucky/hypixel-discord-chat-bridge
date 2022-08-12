const crimson = require('../constants/crimson.js');

module.exports = async (profile) => {
    if (profile.nether_island_player_data) {
        const crimsonIsland = {
            factions: crimson.factions,
            matriarch: crimson.matriarch,
            kuudra_completed_tiers: crimson.kuudra_completed_tiers,
            dojo: crimson.dojo,
        }

        crimsonIsland.factions.selected_faction = profile.nether_island_player_data.selected_faction
        crimsonIsland.factions.mages_reputation = profile.nether_island_player_data.mages_reputation
        crimsonIsland.factions.barbarians_reputation = profile.nether_island_player_data.barbarians_reputation
        crimsonIsland.matriarch.pearls_collected = profile.nether_island_player_data.matriarch.pearls_collected
        crimsonIsland.matriarch.last_attempt = profile.nether_island_player_data.matriarch.last_attempt

        Object.keys(profile.nether_island_player_data.kuudra_completed_tiers).forEach((key) => {
            crimsonIsland.kuudra_completed_tiers[key] = profile.nether_island_player_data.kuudra_completed_tiers[key]
        })
        Object.keys(profile.nether_island_player_data.dojo).forEach((key) => {
            crimsonIsland.dojo[key.toUpperCase()] = profile.nether_island_player_data.dojo[key]
        })

        return crimsonIsland;

    } else {
        return {
            factions: crimson.factions,
            matriarch: crimson.matriarch,
            kuudra_completed_tiers: crimson.kuudra_completed_tiers,
            dojo: crimson.dojo,
        };
    }
};
