module.exports = (profile) => {
  try {
    return {
      diamond: profile.currencies?.essence?.DIAMOND?.current || 0,
      dragon: profile.currencies?.essence?.DRAGON?.current || 0,
      spider: profile.currencies?.essence?.SPIDER?.current || 0,
      wither: profile.currencies?.essence?.WITHER?.current || 0,
      undead: profile.currencies?.essence?.UNDEAD?.current || 0,
      gold: profile.currencies?.essence?.GOLD?.current || 0,
      ice: profile.currencies?.essence?.ICE?.current || 0,
      crimson: profile.currencies?.essence?.CRIMSON?.current || 0
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
