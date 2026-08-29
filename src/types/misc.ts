import type { ChalkInstance } from "chalk";

declare global {
  export interface Console {
    discord: (message: string) => void;
    minecraft: (message: string) => void;
    scripts: (message: string) => void;
    broadcast: (message: string, location: string) => void;
    other: (message: string) => void;
  }
}

export interface LogData {
  level: string;
  background: ChalkInstance;
  color: ChalkInstance;
}

export interface DataWithTimestamp {
  timestamp: number;
}
