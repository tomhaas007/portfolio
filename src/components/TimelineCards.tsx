"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/PortfolioCard";
import type { NotionPage } from "@/lib/card-props";

export function TimelineCards({ items }: { items: NotionPage[] }) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  return (
    <section className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-x-0 -top-12 -bottom-12 overflow-x-auto px-9 py-12">
        <div className="flex h-full min-h-0 items-stretch gap-4">
          {items.map((page) => (
            <PortfolioCard
              key={page.id}
              page={page}
              isExpanded={expandedCardId === page.id}
              onRequestExpand={() => setExpandedCardId(page.id)}
              onToggleExpanded={() =>
                setExpandedCardId((current) => (current === page.id ? null : page.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
