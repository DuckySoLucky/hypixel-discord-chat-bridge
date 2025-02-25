export type Mayor = {
  mayor: {
    key: string;
    name: string;
    perks: Perk[];
    minister?: Minister;
    election: Election;
  };
  current: Current;
};

export type Perk = {
  name: string;
  description: string;
  minister: boolean;
};

export type Minister = {
  key: string;
  name: string;
  perk: Perk;
};

export type Election = {
  year: number;
  candidates: Candidate[];
};

export type Candidate = {
  key: string;
  name: string;
  perks: Perk[];
  votes: number;
};

export type Current = {
  year: number;
  candidates: Candidate[];
};
