export type SlayerLevel = {
  xp: number;
  totalKills: number;
  level: number;
  xpForNext: number;
  progress: number;
  kills: Record<string, number>;
};

export type Slayer = Record<string, SlayerLevel>;
