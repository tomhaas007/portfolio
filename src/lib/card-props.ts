/**
 * Client-safe helpers for displaying portfolio card data.
 * No Notion API or env access - safe to import from client components.
 */

export type NotionPage = {
  id: string;
  url: string;
  title: string;
  properties: Record<string, unknown>;
};

export type CardDisplayProps = {
  images: string[];
  type: string | null;
  skills: string[];
  url: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
};

function normalizeKey(key: string) {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getDateStart(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val || null;
  if (typeof val === "object" && "start" in val) {
    const d = val as { start?: unknown };
    return typeof d.start === "string" ? d.start : null;
  }
  return null;
}

export function getCardDisplayProps(props: Record<string, unknown>): CardDisplayProps {
  const lower = Object.fromEntries(
    Object.entries(props).map(([k, v]) => [normalizeKey(k), v])
  );

  const getImage = (key: string): string | null => {
    const val = lower[key];
    if (!val) return null;
    if (typeof val === "string") return val.trim() || null;
    if (Array.isArray(val)) {
      const first = val.find((item): item is string => typeof item === "string" && item.trim().length > 0);
      return first?.trim() ?? null;
    }
    return null;
  };

  const explicitImageKeys = [
    "image_1",
    "image_2",
    "image_3",
    "image1",
    "image2",
    "image3",
  ];
  const discoveredImageKeys = Object.keys(lower)
    .filter((key) => /^image_?\d+$/.test(key))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const imageKeys = (discoveredImageKeys.length > 0
    ? discoveredImageKeys
    : explicitImageKeys
  ).slice(0, 3);

  const images = imageKeys
    .map((k) => getImage(k))
    .filter((url): url is string => !!url);

  const typeVal = lower.type ?? lower.kind;
  const type = typeof typeVal === "string" ? typeVal : null;

  const skillsVal = lower.skills;
  const skills = Array.isArray(skillsVal)
    ? skillsVal.filter((s): s is string => typeof s === "string")
    : [];

  const url = (lower.url as string) ?? (lower.link as string) ?? null;

  const locationVal = lower.location ?? lower.place;
  const location = typeof locationVal === "string" ? locationVal : null;

  let startDate: string | null = null;
  let endDate: string | null = null;

  const dateVal = lower.date ?? lower.dates;
  if (dateVal && typeof dateVal === "object" && "start" in dateVal) {
    const d = dateVal as { start?: unknown; end?: unknown };
    startDate = typeof d.start === "string" ? d.start : null;
    endDate = typeof d.end === "string" ? d.end : null;
  } else if (typeof dateVal === "string") {
    startDate = dateVal;
  }

  // Fallback: separate Start/End date properties (common in Notion DBs)
  startDate =
    startDate ??
    getDateStart(lower.start_date ?? lower.start ?? lower.from ?? lower.begin);
  endDate =
    endDate ??
    getDateStart(lower.end_date ?? lower.end ?? lower.to ?? lower.until);

  const descVal = lower.description ?? lower.desc;
  const description = typeof descVal === "string" ? descVal : null;

  return {
    images,
    type,
    skills,
    url,
    location,
    startDate,
    endDate,
    description,
  };
}
