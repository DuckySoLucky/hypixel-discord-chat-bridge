export type AsyncListener<Arguments extends readonly unknown[]> = (...args: Arguments) => Promise<void>;

export function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === "string" ? error : JSON.stringify(error));
}

export function safeListener<Arguments extends readonly unknown[]>(
  listener: AsyncListener<Arguments>,
  reportError: (error: unknown) => Promise<void> | void
): (...args: Arguments) => void {
  return (...args) => {
    void listener(...args).catch((error: unknown) => {
      void Promise.resolve(reportError(error)).catch(console.error);
    });
  };
}

export function runDetached(task: Promise<unknown>, reportError: (error: unknown) => Promise<void> | void = console.error): void {
  void task.catch((error: unknown) => {
    void Promise.resolve(reportError(error)).catch(console.error);
  });
}

export function hasErrorCode(error: unknown, code: string): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
