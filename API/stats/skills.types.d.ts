export type Level = {
  xp: number;
  level: number;
  maxLevel: number;
  xpCurrent: number;
  xpForNext: number;
  progress: number;
  levelCap: number;
  uncappedLevel: number;
  levelWithProgress: number;
  unlockableLevelWithProgress: number;
  maxExperience: number;
};

export type Skills = Record<string, Level>;
