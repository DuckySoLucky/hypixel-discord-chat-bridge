const isItemRecombobulated = function (item) {
    let recombobulated;

    if (item.tag?.ExtraAttributes?.rarity_upgrades != undefined) {
        recombobulated = true;
    }

    return recombobulated;
};

const getNetworth = async function (data, profile, bank) {
    const output = { categories: {} };

    for (const key of Object.keys(data)) {
        const category = { items: [], total: 0 };

        for (const item of data[key].filter((i) => i.price)) {
            category.total += item.price;
            category.items.push({
                id: item.modified.id,
                name: item.modified.name,
                price: parseInt(item.price),
                recomb: isItemRecombobulated(item),
                heldItem: item.heldItem,
                winning_bid: item?.tag?.ExtraAttributes?.winning_bid,
                base: item?.modified?.base,
                calculation: item?.modified?.calculation,
                candyUsed: item.candyUsed,
                isPet: item?.modified?.isPet,
                count: item.Count ?? 1,
            });
        }

        if (category.items.length > 0) {
            category.items = category.items
                .sort((a, b) => b.price - a.price)
                .reduce((r, a) => {
                    const last = r[r.length - 1];
                    if (last && last.name === a.name) {
                        last.price += a.price;
                        last.count += a.count;
                        last.recomb = last.recomb || a.recomb;
                        last.heldItem = last.heldItem || a.heldItem;
                        last.winning_bid = last.winning_bid || a.winning_bid;
                        last.base = last.base || a.base;
                        last.calculation = last.calculation || a.calculation;
                        last.candyUsed = last.candyUsed || a.candyUsed;
                        last.isPet = last.isPet || a.isPet;
                    } else {
                        r.push(a);
                    }
                    return r;
                }, [])
                .filter((e) => e);

            output.categories[key] = {
                total: parseInt(category.total),
                top_items: category.items,
            };
        }
    }

    output.bank = bank || 0;
    output.personal_bank = (profile.bank_account || 0) !== (bank || 0) ? profile.bank_account || 0 : 0;
    output.purse = profile.coin_purse ?? 0;

    output.networth = Object.values(output.categories).reduce((a, b) => a + b.total, 0) + output.bank + output.personal_bank + output.purse;

    return output;
};

module.exports = { getNetworth };