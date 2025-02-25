import { Level } from "./skills.types";

export type Forge = {
  id: string;
  name: string;
  slot: number;
  timeStarted: number;
  timeFinished: number;
  timeFinishedText: string;
}[];

export type HotM = {
  powder: {
    mithril: {
      spent: number;
      current: number;
      total: number;
    };
    gemstone: {
      spent: number;
      current: number;
      total: number;
    };
    glacite: {
      spent: number;
      current: number;
      total: number;
    };
  };
  level: Level;
  ability: string;
};
