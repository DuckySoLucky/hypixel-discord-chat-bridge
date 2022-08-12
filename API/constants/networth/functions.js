

const pet_items = require('../pet_items')
const ignored_items = require('./ignored_items')
const reforge_stones = require('./reforge_stones')
const ignored_enchantments = require('./ignored_enchantments')
const essence_upgrades = require('./essence_upgrades')
const { forgeItemTimes } = require('../mining')
const { titleCase } = require('../functions')
const format_item_name = (name, item, { pet = false, tier = 'common', level = null, tierboosted = false } = {}) => {
    name = name.toLowerCase();
    if (pet) {
        if (!level) {
            const match = (name.match(/\[lvl ?(?<level>[0-9]+)]/))
            if (match.groups.level <= 75) level = 1
            if (match.groups.level > 75) level = 2
            if (match.groups.level > 89) level = 3
            if (match.groups.level == 100) level = 4
            name = name.replace(/\[lvl ?([0-9]*)] ?/gi, `${level}:`).replace(/_/g, ' ');
            name = `${tier}:${name}`
        } else name = `${tier}:${level}:${name}${tierboosted ? ':t' : ''}`.replace(/_/g, ' ');
    } else {
        if (item.tag?.ExtraAttributes?.modifier) {
            name = name.substring(name.indexOf(' ') + 1)
        }
        if (name === 'beastmaster crest') {
            let id = item.tag.ExtraAttributes?.id.split('_')
            let beast_rarity = id[id.length - 1].toLowerCase()
            name = `${beast_rarity}:${name}`
        }
    }
    name = name.replace(/§[0-9a-k]/g, '').replace(/✪/g, '').replace(/✦/g, '');
    return name.trim();
}

function getBazaarPrice(id, prices) {
    return prices[id] || 0
}

const materials_to_id = {
    WHEAT: 'WHEAT',
    CANE: 'SUGAR_CANE',
    CARROT: 'CARROT_ITEM',
    WARTS: 'NETHER_STALK',
    POTATO: 'POTATO_ITEM'
}
function getHoe(id) {
    id = id.split('_')
    const level = id[id.length - 1]
    const material = materials_to_id[id[id.length - 2]]
    return { level: Number(level), material }
}

const pet_raritys = ['common', 'uncommon', 'rare', 'epic', 'legendary']

const essence_prices = {
    Wither: 3500,
    Undead: 800,
    Diamond: 4000,
    Gold: 3500,
    Ice: 4000,
    Spider: 3000,
    Dragon: 750
}

const master_stars = ['first master star', 'second master star', 'third master star', 'fourth master star', 'fifth master star']

module.exports = {
    getPrice: function getPrice(item, prices, pet = false) {
        try {
            let name;
            if (pet) {
                let tierboosted = false;
                if (item.heldItem) {
                    if (item.heldItem === 'PET_ITEM_TIER_BOOST') {
                        tierboosted = true
                    }
                }
                let level = 1;
                if (item.level <= 75) level = 1
                if (item.level > 75) level = 2
                if (item.level > 90) level = 3
                if (item.level == 100) level = 4
                if (tierboosted) {
                    item.tier = pet_raritys[pet_raritys.indexOf(item.tier.toLowerCase()) + 1]
                }
                name = format_item_name(item.type.toLowerCase(), item, { pet: true, tier: item.tier.toLowerCase(), level, tierboosted })
            } else {
                name = format_item_name(item?.tag?.display?.Name, item)
            }
            let key = (Object.keys(prices).includes(name)) ? name : Object.keys(prices).includes(item.tag?.ExtraAttributes.id) ? item.tag?.ExtraAttributes.id : null
            let val = 0
            if (key == null) {
                if (item.tag.display.Lore[item.tag.display.Lore.length - 1].includes('HOE') && item.tag.ExtraAttributes.id.startsWith('THEORETICAL')) {
                    const hoe = getHoe(item.tag.ExtraAttributes.id)
                    const tickets = hoe.level == 2 ? prices['JACOBS_TICKET'] * 64 : prices['JACOBS_TICKET'] * 256
                    val = 1000000 + 256 * (prices[hoe.material] * (144 ** (hoe.level - 1))) + tickets
                } else {
                    return {
                        name: item.tag?.display?.Name.replace(/§[0-9a-k]/g, ''),
                        value: 0,
                        base_item_price: 0,
                        calculation: [
                            {
                                type: 'Item Not Found',
                                value: 0,
                                amount: 1
                            }
                        ]
                    }
                }
            } else {
                val = prices[key] * (item.Count || 1)
            }
            const extra_information = []
            let base_item_price = val
            if (!pet) {
                //PRICE PAYED (Midas Sword + Midas Staff)
                if (name.includes('midas staff')) {
                    val = 15_000_000 + item.tag.ExtraAttributes?.winning_bid || 0
                    base_item_price = 15_000_000
                    extra_information.push({ type: 'Winning Price', value: (item.tag.ExtraAttributes?.winning_bid || 0), amount: 1 })
                } else if (name.includes("midas' sword")) {
                    val = item.tag.ExtraAttributes?.winning_bid || 1_000_000
                    base_item_price = 0
                    extra_information.push({ type: 'Winning Price', value: (item.tag.ExtraAttributes?.winning_bid || 0), amount: 1 })
                }

                //HOT POTATO BOOKS + FUMING POTATO BOOKS
                if (item.tag.ExtraAttributes.hot_potato_count) {
                    if (item.tag.ExtraAttributes.hot_potato_count > 10) {
                        val += prices['HOT_POTATO_BOOK'] || 0 * 10
                        val += prices['FUMING_POTATO_BOOK'] || 0 * item.tag.ExtraAttributes.hot_potato_count - 10
                        extra_information.push({ type: 'Hot Potato Book', value: (prices['HOT_POTATO_BOOK'] || 0) * 10, amount: 10 })
                        extra_information.push({ type: 'Fuming Potato Book', value: (prices['FUMING_POTATO_BOOK'] || 0) * item.tag.ExtraAttributes.hot_potato_count - 10, amount: item.tag.ExtraAttributes.hot_potato_count - 10 })
                    } else {
                        val += prices['HOT_POTATO_BOOK'] || 0 * item.tag.ExtraAttributes.hot_potato_count
                        extra_information.push({ type: 'Hot Potato Book', value: (prices['HOT_POTATO_BOOK'] || 0) * item.tag.ExtraAttributes.hot_potato_count, amount: item.tag.ExtraAttributes.hot_potato_count })
                    }
                }

                //ART OF WAR
                if (item.tag.ExtraAttributes.art_of_war_count) {
                    val += prices['the art of war'] || 0 * item.tag.ExtraAttributes.art_of_war_count
                    extra_information.push({ type: 'Art of War', value: (prices['the art of war'] || 0) * item.tag.ExtraAttributes.art_of_war_count, amount: item.tag.ExtraAttributes.art_of_war_count })
                }

                //FARMING FOR DUMMIES
                if (item.tag.ExtraAttributes.farming_for_dummies_count) {
                    val += prices['farming for dummies'] || 0 || 0 * item.tag.ExtraAttributes.farming_for_dummies_count
                    extra_information.push({ type: 'Farming for Dummies', value: (prices['farming for dummies'] || 0) * item.tag.ExtraAttributes.farming_for_dummies_count, amount: item.tag.ExtraAttributes.farming_for_dummies_count })
                }

                //REFORGE
                let reforge = item.tag.display.Name.substring(0, item.tag.display.Name.indexOf(' '))
                reforge = reforge.replace(/✪/g, '').replace(/\[lvl ?[0-9]*]/gi, '').replace(/§[0-9a-k]/g, '').replace(/⚚/g, '').replace(/✦/g, '')
                if (reforge_stones[reforge]) {
                    val += prices[reforge_stones[reforge].item_name.toLowerCase()] || 0
                    extra_information.push({ type: `${reforge} Reforge`, value: (prices[reforge_stones[reforge].item_name.toLowerCase()] || 0), amount: 1 })
                }

                //ENCHANTMENTS
                const enchantments = []
                let enchantment_value = 0
                if (item.tag.ExtraAttributes.enchantments) {
                    for (const enchantment of Object.keys(item.tag.ExtraAttributes.enchantments)) {
                        let name = (`${enchantment} ${item.tag.ExtraAttributes.enchantments[enchantment]}`).toLowerCase().replace(/_/g, ' ')
                        if (ignored_enchantments.includes(name)) {
                            val += 1000
                            enchantment_value += 1000
                            enchantments.push({ name: titleCase(name), value: 1000, amount: 1 })
                        } else {
                            if (!item.tag.display.Name.toLowerCase().includes('ice spray wand') && !name.includes('scavenger 5')) {
                                if (!item.tag.display?.Name.toLowerCase().includes('stonk') && enchantment === 'efficiency' && item.tag.ExtraAttributes?.enchantments[enchantment] > 5) {
                                    //SILEX (Efficiency Enchantment Upgrade)
                                    val += prices['silex'] || 0 * (item.tag.ExtraAttributes.enchantments[enchantment] - 5)
                                    extra_information.push({ type: 'Silex', value: (prices['silex'] || 0) * (item.tag.ExtraAttributes.enchantments[enchantment] - 5), amount: item.tag.ExtraAttributes.enchantments[enchantment] - 5 })
                                }
                                val += prices[name] || 0
                                enchantment_value += prices[name] || 0
                                enchantments.push({ name: titleCase(name), value: (prices[name] || 0), amount: 1 })
                            }
                        }
                    }
                }
                if (enchantments.length > 0) extra_information.push({ type: 'Enchantments', enchants: enchantments, value: enchantment_value, amount: enchantments.length })

                //SCROLLS (Necron's Blade)
                if (name.includes('scylla') || name.includes('astraea') || name.includes('hyperion') || name.includes('valkyrie')) {
                    if (item.tag.ExtraAttributes.ability_scroll) {
                        for (let scroll of item.tag.ExtraAttributes.ability_scroll) {
                            scroll = scroll.replace('WITHER_SHIELD_SCROLL', 'wither shield').replace('SHADOW_WARP_SCROLL', 'shadow warp').replace('IMPLOSION_SCROLL', 'implosion')
                            val += prices[scroll] || 0
                            extra_information.push({ type: titleCase(scroll), value: (prices[scroll] || 0), amount: 1 })
                        }
                    }
                }

                //DUNGEON STARS
                if (item.tag.ExtraAttributes?.dungeon_item_level && item.tag.ExtraAttributes?.id) {
                    let id = item.tag.ExtraAttributes.id
                    if (essence_upgrades[id]) {
                        let essence_item = essence_upgrades[id]
                        let essence_amount = 0

                        for (let i = 0; i <= item.tag.ExtraAttributes.dungeon_item_level && i <= 5; i++) {
                            let item_level = i == 0 ? 'dungeonize' : i
                            essence_amount += essence_item[item_level] || 0
                        }
                        val += essence_amount * essence_prices[essence_item.type]
                        extra_information.push({ type: `${essence_item.type} Essence`, value: essence_amount * essence_prices[essence_item.type], amount: essence_amount })

                        if (item.tag.ExtraAttributes.dungeon_item_level > 5) {
                            for (let i = 0; i < item.tag.ExtraAttributes.dungeon_item_level - 5; i++) {
                                val += prices[master_stars[i]] || 0
                                extra_information.push({ type: titleCase(master_stars[i]), value: (prices[master_stars[i]]) || 0, amount: 1 })
                            }
                        }
                    }
                }

                //SKIN
                if (item.tag.ExtraAttributes.skin) {
                    val += prices[item.tag.ExtraAttributes.skin] || 0
                    extra_information.push({ type: titleCase(item.tag.ExtraAttributes.skin.replace(/_/g, ' ')), value: (prices[item.tag.ExtraAttributes.skin] || 0), amount: 1 })
                }

                //ENRICHMENTS
                if (item.tag.ExtraAttributes.talisman_enrichment) {
                    val += prices[item.tag.ExtraAttributes.talisman_enrichment.toLowerCase().replace(/_/g, ' ') + ' enrichment'] || 0
                    extra_information.push({ type: titleCase(item.tag.ExtraAttributes.talisman_enrichment.replace(/_/g, ' ') + ' Enrichment'), value: (prices[item.tag.ExtraAttributes.talisman_enrichment.toLowerCase().replace(/_/g, ' ') + ' enrichment'] || 0), amount: 1 })
                }

                //GEMSTONES
                if (item.tag.ExtraAttributes?.gems) {
                    for (const gem of Object.keys(item.tag.ExtraAttributes.gems)) {
                        val += prices[`${item.tag.ExtraAttributes.gems[gem]}_${gem.substring(0, gem.length - 2)}_GEM`] || 0
                        if (prices[`${item.tag.ExtraAttributes.gems[gem]}_${gem.substring(0, gem.length - 2)}_GEM`] || 0 > 0) {
                            extra_information.push({ type: `${titleCase(gem.substring(0, gem.length - 2))} Gemstone`, value: (prices[`${item.tag.ExtraAttributes.gems[gem]}_${gem.substring(0, gem.length - 2)}_GEM`] || 0), amount: 1 })
                        }
                    }
                }

                //WOODEN SINGULARITY
                if (item.tag.ExtraAttributes.wood_singularity_count) {
                    val += prices['wood singularity'] || 0
                    extra_information.push({ type: 'Wood Singularity', value: (prices['wood singularity'] || 0), amount: 1 })
                }

                //TRANSMISSION TUNERS
                if (item.tag.ExtraAttributes.tuned_transmission) {
                    val += prices['transmission tuner'] || 0 * item.tag.ExtraAttributes.tuned_transmission
                    extra_information.push({ type: 'Wood Singularity', value: (prices['wood singularity'] || 0) * item.tag.ExtraAttributes.tuned_transmission, amount: 1 })
                }

                //ETHERMERGE (Aspect of the Void)
                if (item.tag.ExtraAttributes.ethermerge) {
                    val += prices['etherwarp conduit'] || 0 + prices['etherwarp merger'] || 0
                    extra_information.push({ type: 'Ether Transmission', value: prices['etherwarp conduit'] || 0 + prices['etherwarp merger'] || 0, amount: 1 })
                }

                //DRILLS
                if (item.tag.ExtraAttributes.drill_part_upgrade_module) {
                    let price = prices[forgeItemTimes[item.tag.ExtraAttributes.drill_part_upgrade_module.toUpperCase()].name.toLowerCase()] || 0
                    val += price
                    extra_information.push({ type: `${forgeItemTimes[item.tag.ExtraAttributes.drill_part_upgrade_module.toUpperCase()].name}`, value: price, amount: 1 })
                }
                if (item.tag.ExtraAttributes.drill_part_engine) {
                    let price = prices[forgeItemTimes[item.tag.ExtraAttributes.drill_part_engine.toUpperCase()].name.toLowerCase()] || 0
                    val += price
                    extra_information.push({ type: `${forgeItemTimes[item.tag.ExtraAttributes.drill_part_engine.toUpperCase()].name}`, value: price, amount: 1 })
                }
                if (item.tag.ExtraAttributes.drill_part_fuel_tank) {
                    let price = prices[forgeItemTimes[item.tag.ExtraAttributes.drill_part_fuel_tank.toUpperCase()].name.toLowerCase()] || 0
                    val += price
                    extra_information.push({ type: `${forgeItemTimes[item.tag.ExtraAttributes.drill_part_fuel_tank.toUpperCase()].name}`, value: price, amount: 1 })
                }

                //RECOMBOBULATOR
                if (val > 600000 || item.tag.display.Lore.includes('ACCESSORY')) {
                    val += item.tag.ExtraAttributes.rarity_upgrades ? prices['RECOMBOBULATOR_3000'] || 0 : 0
                    if (item.tag.ExtraAttributes.rarity_upgrades) extra_information.push({ type: 'Recombobulator 3000', value: (prices['RECOMBOBULATOR_3000'] || 0), amount: 1 })
                }
            } else {
                //GET PET SKIN
                if (item?.skin) {
                    val += getBazaarPrice(`PET_SKIN_${item.skin}`, prices)
                    extra_information.push({ type: titleCase(item.skin + ' Skin'), value: getBazaarPrice(`PET_SKIN_${item.skin}`, prices), amount: 1 })
                }
                //GET PET ITEM
                if (item?.heldItem && pet_items[item?.heldItem]) {
                    if (pet_items[item?.heldItem].rarity) {
                        val += getBazaarPrice(`${pet_items[item?.heldItem].rarity}:${pet_items[item.heldItem].item_name.toLowerCase()}`, prices)
                        extra_information.push({ type: titleCase(pet_items[item.heldItem].item_name), value: getBazaarPrice(`${pet_items[item?.heldItem].rarity}:${pet_items[item.heldItem].item_name.toLowerCase()}`, prices), amount: 1 })
                    } else {
                        val += getBazaarPrice(pet_items[item.heldItem].item_name.toLowerCase(), prices)
                        extra_information.push({ type: titleCase(pet_items[item.heldItem].item_name), value: getBazaarPrice(pet_items[item.heldItem].item_name.toLowerCase(), prices), amount: 1 })
                    }
                }
            }
            if (ignored_items.includes(name)) return {
                value: 1000,
                base_item_price: 1000,
                calculation: [
                    {
                        type: 'Ignored Item',
                        value: 1000,
                        amount: 1
                    }
                ]
            }
            return {
                name: (item.tag?.display?.Name || item.type).replace(/§[0-9a-k]/g, ''),
                value: val,
                base_item_price,
                amount: item.Count || 0,
                calculation: extra_information
            }
        } catch (err) {
            return {
                name: (item.tag?.display?.Name || item?.type || 'null').replace(/§[0-9a-k]/g, ''),
                value: 0,
                base_item_price: 0,
                calculation: [
                    {
                        type: 'Error',
                        value: 0,
                        amount: 1
                    }
                ]
            }
        }
    },
    getBazaarPrice
}