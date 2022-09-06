module.exports = (profile, bingo) => {
  profile = Object.values(
    profile.events[Object.values(profile.events).length - 1]
  );
  const completedGoals = profile[profile.length - 1];
  const bingoGoals = bingo.goals;
  const player = [];
  const community = [];

  for (const quest of bingoGoals) {
    if (!quest.tiers) {
      const questData = {
        completed: completedGoals.includes(quest.id),
        id: quest.id,
        name: quest.name,
        lore: quest?.lore,
        requiredAmount: quest.requiredAmount,
      };
      player.push(questData);
    } else {
      const questData = {
        completed: quest.progress > quest.tiers[quest.tiers.length - 1],
        id: quest.id,
        name: quest.name,
        tiers: quest.tiers,
        progress: quest.progress,
      };
      community.push(questData);
    }
  }
  return {
    points: profile[profile.length - 2],
    id: bingo.id,
    player,
    community,
  };
};
