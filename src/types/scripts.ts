export interface ScriptOptions {
  id: string;
  enabled: boolean;
  cron?: string;
  interval?: string;
}

export enum ScriptLogState {
  Good,
  Bad,
  Misc
}
