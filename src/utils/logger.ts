export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    if (meta) {
      console.log(`[INFO] ${message}`, meta);
      return;
    }
    console.log(`[INFO] ${message}`);
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error ?? "");
  },
};
