import { Level } from "./skills";

export type Garden = {
  level: Level;
  cropMilesstone: {
    wheat: Level;
    carrot: Level;
    sugarCane: Level;
    potato: Level;
    netherWart: Level;
    pumpkin: Level;
    melon: Level;
    mushroom: Level;
    cocoaBeans: Level;
    cactus: Level;
  };
};
