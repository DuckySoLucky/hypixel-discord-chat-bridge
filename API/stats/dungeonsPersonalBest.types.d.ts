export type PersonalBest = {
  normal: Record<string, PersonalBestFloor>;
  master: Record<string, PersonalBestFloor>;
};

export type PersonalBestFloor = {
  fastest: number | null;
  fastest_s: number | null;
  fastest_s_plus: number | null;
};
