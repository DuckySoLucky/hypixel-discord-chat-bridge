// CREDIT: https://github.com/slothpixel/core/ (util/calculateLevel.js)
module.exports = (player) => {
  const BASE = 10000;
  const GROWTH = 2500;

  const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
  const REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
  const GROWTH_DIVIDES_2 = 2 / GROWTH;

  const experience = player?.networkExp || 0;

  const level =
    experience <= 1
      ? 1
      : 1 +
        REVERSE_PQ_PREFIX +
        Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * experience);
  return level;
};
