"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getCardDisplayProps, type NotionPage } from "@/lib/notion";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  if (y && m) return `${m}/${y}`;
  return iso;
}

export function PortfolioCard({ page }: { page: NotionPage }) {
  const [isHovered, setIsHovered] = useState(false);
  const props = getCardDisplayProps(page.properties);
  const {
    images,
    type,
    skills,
    url,
    location,
    startDate,
    endDate,
    description,
  } = props;

  const dateRange =
    startDate || endDate
      ? `${formatDate(startDate)} — ${endDate ? formatDate(endDate) : "today"}`
      : null;

  const hasHoverContent =
    images.length > 0 ||
    type ||
    skills.length > 0 ||
    location ||
    dateRange ||
    description;

  return (
    <article
      className="relative flex h-full w-[320px] flex-shrink-0 flex-col rounded-[24px] border border-primary-300/60 bg-primary-100 p-6 transition-colors hover:border-primary-700/30 md:w-[420px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {isHovered && hasHoverContent ? (
          <motion.div
            key="hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-1 flex-col gap-4"
          >
            {/* Grouped images - staggered overlap, middle in front */}
            {images.length > 0 && (
              <div className="flex justify-center items-end">
                {images.map((src, i) => {
                  const isMiddle = images.length === 3 ? i === 1 : images.length === 2 ? i === 1 : true;
                  const yOffset = images.length === 3
                    ? (i === 0 ? 8 : i === 2 ? 8 : 0)
                    : images.length === 2
                      ? (i === 0 ? 6 : 0)
                      : 0;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      // Remote image URLs come from Notion and are rendered as-is.
                      key={i}
                      src={src}
                      alt=""
                      className="rounded-[12px] object-cover shadow-md border border-primary-300/40"
                      style={{
                        height: 100,
                        width: "auto",
                        maxWidth: 72,
                        marginLeft: i === 0 ? 0 : -20,
                        zIndex: isMiddle ? 2 : 1,
                        transform: `translateY(${yOffset}px)`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {type && (
                <span
                  className="rounded-full px-3 py-1 text-body font-medium text-white"
                  style={{ backgroundColor: "var(--color-type-pill)" }}
                >
                  {type}
                </span>
              )}
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-3 py-1 text-body font-medium text-white"
                  style={{ backgroundColor: "var(--color-skills-pill)" }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Title */}
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

            {/* Location & dates */}
            {(location || dateRange) && (
              <div className="flex items-center gap-2 text-body text-primary-700">
                {location && <span>{location}</span>}
                {location && dateRange && (
                  <span className="h-1 w-1 rounded-full bg-primary-300" />
                )}
                {dateRange && <span>{dateRange}</span>}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="line-clamp-3 text-body text-primary-700 text-ellipsis">
                {description}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-auto"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
