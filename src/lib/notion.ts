import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is required. Add it to .env.local");
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export type NotionPage = {
  id: string;
  url: string;
  title: string;
  properties: Record<string, unknown>;
};

function extractPropertyValue(
  prop: { type: string; [key: string]: unknown } | undefined
): string | string[] | null {
  if (!prop) return null;

  switch (prop.type) {
    case "title":
      const titleContent = (prop.title as { plain_text: string }[]) ?? [];
      return titleContent.map((t) => t.plain_text).join("") || null;
    case "rich_text":
      const richContent = (prop.rich_text as { plain_text: string }[]) ?? [];
      return richContent.map((t) => t.plain_text).join("") || null;
    case "url":
      return (prop.url as string) ?? null;
    case "date":
      const date = prop.date as { start: string } | null;
      return date?.start ?? null;
    case "multi_select":
      const multiSelect = (prop.multi_select as { name: string }[]) ?? [];
      return multiSelect.map((s) => s.name);
    case "select":
      const select = prop.select as { name: string } | null;
      return select?.name ?? null;
    case "number":
      return prop.number != null ? String(prop.number) : null;
    case "checkbox":
      return prop.checkbox ? "Yes" : "No";
    default:
      return null;
  }
}

async function resolveDataSourceId(databaseId: string): Promise<string> {
  try {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    if ("data_sources" in db && Array.isArray(db.data_sources) && db.data_sources.length > 0) {
      return db.data_sources[0].id;
    }
  } catch {
    // Fallback: use database ID as data source ID (legacy single-source databases)
  }
  return databaseId;
}

export async function getPortfolioItems(): Promise<NotionPage[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    console.warn("NOTION_DATABASE_ID not set. Add your database ID to .env.local");
    return [];
  }

  const dataSourceId = await resolveDataSourceId(databaseId);

  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      result_type: "page",
    });
  } catch (error) {
    console.warn("Failed to query Notion data source. Check NOTION_DATABASE_ID and sharing.", error);
    return [];
  }

  return response.results.map((item) => {
    if (item.object !== "page" || !("properties" in item)) {
      return {
        id: item.id,
        url: "url" in item ? (item.url as string) : "",
        title: "Untitled",
        properties: {},
      };
    }

    const properties: Record<string, unknown> = {};
    let title = "Untitled";

    for (const [key, prop] of Object.entries(item.properties)) {
      const typedProp = prop as { type: string; [key: string]: unknown };
      const value = extractPropertyValue(typedProp);
      if (value != null) {
        properties[key] = value;
      }
      if (typedProp.type === "title" && typeof value === "string") {
        title = value;
      }
    }

    return {
      id: item.id,
      url: "url" in item ? (item.url as string) : "",
      title,
      properties,
    };
  });
}
