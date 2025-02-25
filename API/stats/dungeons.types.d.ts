import { Level } from "./skills.types";

export type Dungeons = {
  selectedClass: string;
  secretsFound: number;
  dungeons: Level;
  classAverage: number;
  classes: Record<string, Level>;
};
