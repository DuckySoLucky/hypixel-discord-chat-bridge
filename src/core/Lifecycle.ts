export type LifecycleState = "idle" | "starting" | "running" | "stopping";

export interface Lifecycle {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface Disposable {
  dispose(): Promise<void> | void;
}
