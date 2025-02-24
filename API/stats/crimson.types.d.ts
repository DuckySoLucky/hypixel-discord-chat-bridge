export type CrimsonIsle = {
  faction: string;
  reputation: {
    barbarian: number;
    mage: number;
  };
};

export type Dojo = {
  belt: string;
  force: {
    points: number;
    rank: string;
  };
  stamina: {
    points: number;
    rank: string;
  };
  mastery: {
    points: number;
    rank: string;
  };
  discipline: {
    points: number;
    rank: string;
  };
  swiftness: {
    points: number;
    rank: string;
  };
  control: {
    points: number;
    rank: string;
  };
  tenacity: {
    points: number;
    rank: string;
  };
};

export type Kuudra = {
  basic: number;
  hot: number;
  burning: number;
  fiery: number;
  infernal: number;
};

export type TrophyFishing = {
  rank: string;
  caught: {
    total: number;
    bronze: number;
    silver: number;
    gold: number;
    diamond: number;
  };
};
