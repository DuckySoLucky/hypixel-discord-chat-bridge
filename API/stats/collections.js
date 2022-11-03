const collections = require("../data/collections.json");

module.exports = (profileData) => {
  const playersCollections = [];
  for (const collection of collections) {
    playersCollections.push({
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
      for (const collectionId of Object.keys(
        profileData.members[member]?.collection
      )) {
        const collection = playersCollections.find(
          (a) => a.id === collectionId
        );
        if (collection) {
          collection.amount +=
            profileData.members[member].collection[collectionId];
          const contributions = collection.contributions.find(
            (a) => a.user === member
          );
          if (contributions) {
            contributions.amount +=
              profileData.members[member].collection[collectionId];
          } else {
            collection.contributions.push({
              user: member,
              amount: profileData.members[member].collection[collectionId],
            });
          }
        }
      }
    }
  }

  for (const collection of playersCollections) {
    const foundCollection = collections.find((a) => a.id === collection.id);
    if (foundCollection) {
      for (const tier of foundCollection.tiers) {
        if (tier.amountRequired < collection.amount)
          {collection.tier = tier.tier;}
      }
    }
  }

  return playersCollections;
};
