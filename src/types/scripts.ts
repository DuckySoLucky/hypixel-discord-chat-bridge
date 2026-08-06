import ms, { type StringValue } from "ms";

export type ScriptSchedule = { readonly type: "cron"; readonly expression: string } | { readonly type: "interval"; readonly milliseconds: number };

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

export enum ScriptLogState {
  Good,
  Bad,
  Misc
}
