/** Batches rapid stream updates to a steady UI refresh rate (~30fps). */
export function createUiThrottle(intervalMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: (() => void) | null = null;

  return {
    schedule(callback: () => void) {
      pending = callback;
      if (timer !== null) {
        return;
      }

      timer = setTimeout(() => {
        timer = null;
        pending?.();
        pending = null;
      }, intervalMs);
    },
    flush() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      pending?.();
      pending = null;
    },
    cancel() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      pending = null;
    },
  };
}
