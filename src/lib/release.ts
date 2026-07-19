export interface ReleaseInfo {
  version: string | null;
  name: string | null;
  publishedAt: string | null;
  notesUrl: string | null;
  windows: { url: string; size: number } | null;
  available: boolean;
  message?: string;
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  try {
    const res = await fetch("/api/releases/latest");
    if (!res.ok) throw new Error("bad status");
    return (await res.json()) as ReleaseInfo;
  } catch {
    return {
      version: null,
      name: null,
      publishedAt: null,
      notesUrl: null,
      windows: null,
      available: false,
      message: "Release information is temporarily unavailable.",
    };
  }
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
}
