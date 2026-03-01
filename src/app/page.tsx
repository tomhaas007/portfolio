import { getPortfolioItems, type NotionPage } from "@/lib/notion";

function getDisplayProps(props: Record<string, unknown>) {
  const lower = Object.fromEntries(
    Object.entries(props).map(([k, v]) => [k.toLowerCase().replace(/\s/g, "_"), v])
  );
  return {
    url: (lower.url as string) ?? (lower.link as string) ?? null,
  };
}

function PortfolioCard({ page }: { page: NotionPage }) {
  const { url } = getDisplayProps(page.properties);

  return (
    <article className="flex h-full w-[320px] flex-shrink-0 flex-col rounded-[24px] border border-primary-300/60 bg-primary-100 p-6 transition hover:border-primary-700/30 md:w-[420px]">
      <div className="mt-auto">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-h1 font-bold text-primary-950 hover:underline"
          >
            {page.title}
          </a>
        ) : (
          <h1 className="text-h1 font-bold text-primary-950">{page.title}</h1>
        )}
      </div>
    </article>
  );
}

export default async function Home() {
  const items = await getPortfolioItems();

  return (
    <div className="h-dvh overflow-hidden bg-primary-300">
      <main className="flex h-full flex-col overflow-hidden">
        <section className="w-full shrink-0 px-9 pt-9 pb-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-h1 text-primary-950">hi! i&apos;m tom.</h1>
            <p className="text-h3 text-primary-700">
              i care about building great products which make the world a little
              better.
            </p>
          </div>
        </section>

        {items.length > 0 ? (
          <section className="flex min-h-0 flex-1 flex-col px-9">
            <div className="flex h-full min-h-0 flex-1 -mx-9 items-stretch gap-4 overflow-x-auto overflow-y-hidden px-9">
              {items.map((page) => (
                <PortfolioCard key={page.id} page={page} />
              ))}
            </div>
          </section>
        ) : (
          <section className="w-full flex-1 px-9">
            <p className="text-body text-primary-700">
              Add NOTION_DATABASE_ID to .env.local and connect your Notion
              database to see your portfolio items here.
            </p>
          </section>
        )}

        <section className="w-full shrink-0 px-9 pt-5 pb-9">
          <p className="text-body text-primary-700">
            designed and built by myself in berlin, germany.
          </p>
        </section>
      </main>
    </div>
  );
}
