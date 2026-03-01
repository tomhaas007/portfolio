import { getPortfolioItems } from "@/lib/notion";
import { PortfolioCard } from "@/components/PortfolioCard";

export default async function Home() {
  const items = await getPortfolioItems();

  return (
    <div className="h-dvh overflow-x-hidden bg-primary-300">
      <main className="flex h-full flex-col overflow-visible">
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
          <section className="relative flex min-h-0 flex-1 flex-col">
            <div className="absolute inset-x-0 -top-12 -bottom-12 overflow-x-auto px-9 py-12">
              <div className="flex h-full min-h-0 items-stretch gap-4">
                {items.map((page) => (
                  <PortfolioCard key={page.id} page={page} />
                ))}
              </div>
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
