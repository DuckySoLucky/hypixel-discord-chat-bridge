const mobs = require('../constants/mobs')
const { titleCase } = require('../constants/functions')

module.exports = (profile) => {
    const stats = profile?.stats
    if (stats) {
        const deaths = [];

        for (const mob in stats) {
            if (mob.startsWith('deaths_') && stats[mob] > 0) {
                deaths.push({ name: mob.replace('deaths_', ''), id: mob.replace('deaths_', ''), deaths: stats[mob] });
            }
        }

        for (const mob of deaths) {
            if (mob in mobs) {
                mob.name = mobs[mob]
            }
            mob.name = titleCase(mob.name.replace(/_/g, ' '))
        }

        return {
            totalDeaths: stats.deaths,
            types: deaths.sort((a, b) => b.deaths - a.deaths)
        }
    } else {
        return []
    }
}