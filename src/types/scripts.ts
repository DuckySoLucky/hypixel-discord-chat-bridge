import ms, { type StringValue } from "ms";

export interface CronScriptSchedule {
  readonly type: "cron";
  readonly expression: string;
}

export interface IntervalScriptSchedule {
  readonly type: "interval";
  readonly milliseconds: number;
}

export interface EmptyScriptSchedule {
  readonly type: "empty";
}

export type ScriptSchedule = CronScriptSchedule | IntervalScriptSchedule | EmptyScriptSchedule;

export interface ScriptOptions {
  readonly id: string;
  readonly enabled: boolean;
  readonly schedule: ScriptSchedule;
  readonly overlap?: "allow" | "skip";
}

export function intervalSchedule(value: string): ScriptSchedule {
  return { type: "interval", milliseconds: ms(value as StringValue) };
}

export function cronSchedule(expression: string): ScriptSchedule {
  return { type: "cron", expression };
}

export function emptySchedule(): EmptyScriptSchedule {
  return { type: "empty" };
}

export enum ScriptLogState {
  Good,
  Bad,
  Misc
}
