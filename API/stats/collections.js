const collections = require("../data/collections.json");

module.exports = (profileData) => {
  const players_collections = [];
  for (const collection of collections) {
    players_collections.push({
      name: collection.name,
      id: collection.id,
      category: collection.category,
      maxTiers: collection.maxTiers,
      tier: 0,
      amount: 0,
      contributions: [],
    });
  }

  for (const member of Object.keys(profileData.members)) {
    if (profileData.members[member]?.collection) {
      for (const collection_id of Object.keys(
        profileData.members[member]?.collection
      )) {
        const collection = players_collections.find(
          (a) => a.id === collection_id
        );
        if (collection) {
          collection.amount +=
            profileData.members[member].collection[collection_id];
          const contributions = collection.contributions.find(
            (a) => a.user === member
          );
          if (contributions) {
            contributions.amount +=
              profileData.members[member].collection[collection_id];
          } else {
            collection.contributions.push({
              user: member,
              amount: profileData.members[member].collection[collection_id],
            });
          }
        }
      }
    }
  }

  for (const collection of players_collections) {
    const found_collection = collections.find((a) => a.id === collection.id);
    if (found_collection) {
      for (const tier of found_collection.tiers) {
        if (tier.amountRequired < collection.amount)
          collection.tier = tier.tier;
      }
    }
  }

  return players_collections;
};
