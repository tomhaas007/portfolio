import { getPortfolioItems } from "@/lib/notion";
import { TimelineCards } from "@/components/TimelineCards";
import { FooterEasterEgg } from "@/components/FooterEasterEgg";

export const revalidate = 300;

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
          <TimelineCards items={items} />
        ) : (
          <section className="w-full flex-1 px-9">
            <p className="text-body text-primary-700">
              Add NOTION_DATABASE_ID to .env.local and connect your Notion
              database to see your portfolio items here.
            </p>
          </section>
        )}

        <section className="w-full shrink-0 px-9 pt-5 pb-9">
          <FooterEasterEgg />
        </section>
      </main>
    </div>
  );
}
