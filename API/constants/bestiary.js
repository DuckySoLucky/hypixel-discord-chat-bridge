const axios = require("axios");

function formatBestiaryMobs(mobs) {
  const output = [];
  for (const mob of mobs) {
    output.push({
      name: mob.name.replace(/§./g, ""),
      cap: mob.cap,
      mobs: mob.mobs,
      bracket: mob.bracket
    });
  }

  return output;
}

const cache = {};
async function getBestiaryConstants() {
  if (cache.lastUpdated && cache.lastUpdated + 1000 * 60 * 60 * 12 > Date.now()) {
    return cache.data;
  }

  const response = await axios.get(
    "https://raw.githubusercontent.com/NotEnoughUpdates/NotEnoughUpdates-REPO/refs/heads/master/constants/bestiary.json"
  );
  const bestiary = response?.data;
  if (!bestiary) {
    return null;
  }

  const output = { brackets: bestiary.brackets, islands: {} };
  for (const [islandId, islandData] of Object.entries(bestiary).filter(([key]) => key !== "brackets")) {
    if (islandData.hasSubcategories === true) {
      for (const [categoryId, categoryData] of Object.entries(islandData)) {
        if (categoryData.mobs === undefined) {
          continue;
        }

        const id = islandId === categoryId ? islandId : `${islandId}:${categoryId}`;
        const name = categoryData.name.includes(islandData.name)
          ? categoryData.name
          : `${categoryData.name} ${islandData.name}`;
        output.islands[id] = {
          name: name,
          mobs: formatBestiaryMobs(categoryData.mobs)
        };
      }

      continue;
    }

    output.islands[islandId] = {
      name: islandData.name,
      mobs: formatBestiaryMobs(islandData.mobs)
    };
  }

  cache.data = output;
  cache.lastUpdated = Date.now();

  return output;
}

module.exports = {
  getBestiaryConstants
};
