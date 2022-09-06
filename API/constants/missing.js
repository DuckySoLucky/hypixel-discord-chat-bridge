//CREDIT: https://github.com/SkyCrypt/SkyCryptWebsite
const constants = require("./talismans");

module.exports = function getMissingTalismans(talismans, option = "") {
  let unique = Object.keys(constants.talismans);
  if (option === "max") unique = Object.keys(constants.max_upgrade_talismans);

  unique.forEach((name) => {
    if (name in constants.talisman_duplicates) {
      for (let duplicate of constants.talisman_duplicates[name]) {
        if (talismans.includes(duplicate)) {
          talismans[talismans.indexOf(duplicate)] = name;
          break;
        }
      }
    }
  });

  let missing = unique.filter((talisman) => !talismans.includes(talisman));
  missing.forEach((name) => {
    if (name in constants.talisman_upgrades) {
      //if the name is in the upgrades list
      for (let upgrade of constants.talisman_upgrades[name]) {
        if (talismans.includes(upgrade)) {
          //if talisman list includes the upgrade
          missing = missing.filter((item) => item !== name);
          break;
        }
      }
    }
  });

  const output = [];
  missing.forEach(async (talisman) => {
    let object = {
      name: null,
      rarity: null,
    };

    if (object.id == null) object.id = talisman;

    if (constants.talismans[talisman] != null) {
      const data = constants.talismans[talisman];

      object.name = data.name || null;
      object.rarity = data.rarity || null;
    }

    output.push(object);
  });

  return output;
};
