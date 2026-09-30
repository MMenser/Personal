// Mirrors the JSON returned by dashboard/server/server.mjs at /api/stats.

export interface ThrottleFlags {
  underVoltage: boolean;
  freqCapped: boolean;
  throttled: boolean;
  softTempLimit: boolean;
}

export interface Stats {
  hostname: string;
  model: string | null;
  timestamp: number;
  uptimeSeconds: number;
  load: [number, number, number];
  cpu: { usagePercent: number; perCore: number[]; cores: number };
  temperatureC: number | null;
  memory: { totalBytes: number; usedBytes: number };
  swap: { totalBytes: number; usedBytes: number } | null;
  disk: { path: string; totalBytes: number; usedBytes: number } | null;
  throttled: { raw: string; now: ThrottleFlags; sinceBoot: ThrottleFlags } | null;
  history: {
    timestamps: number[];
    cpuPercent: number[];
    temperatureC: (number | null)[];
  };
}

export type Level = "ok" | "warning" | "critical";
