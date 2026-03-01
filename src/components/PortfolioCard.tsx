"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getCardDisplayProps, type NotionPage } from "@/lib/card-props";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  if (y && m) return `${m}/${y}`;
  return iso;
}

export function PortfolioCard({ page }: { page: NotionPage }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
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
      ? `${startDate ? formatDate(startDate) : ""} — ${endDate ? formatDate(endDate) : "today"}`
      : null;

  const hasHoverContent =
    images.length > 0 ||
    type ||
    skills.length > 0 ||
    location ||
    dateRange ||
    description;

  const titleOpacity = isTitleHovered ? 0.6 : 1;

  return (
    <article
      className="relative flex h-full w-[320px] flex-shrink-0 flex-col overflow-visible rounded-[24px] border-0 bg-primary-100 p-6 outline-none transition-shadow duration-300 focus:outline-none md:w-[420px]"
      style={{
        boxShadow: isHovered ? "0 4px 24px 24px rgba(25, 25, 25, 0.04)" : "none",
      }}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setIsTitleHovered(false);
      }}
    >
      <AnimatePresence mode="wait">
        {isHovered && hasHoverContent ? (
          <motion.div
            key="hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex h-full flex-1 flex-col justify-between"
          >
            {/* Grouped images - staggered overlap, middle in front */}
            {images.length > 0 && (
              <div className="flex min-h-[220px] flex-1 items-center justify-center pb-8 md:min-h-[280px]">
                {images.map((src, i) => {
                  const isMiddle = images.length === 3 ? i === 1 : images.length === 2 ? i === 1 : true;
                  const yOffset = images.length === 3
                    ? (i === 0 ? 20 : i === 2 ? 20 : 0)
                    : images.length === 2
                      ? (i === 0 ? 14 : 0)
                      : 0;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      // Remote image URLs come from Notion and are rendered as-is.
                      key={i}
                      src={src}
                      alt=""
                      className="h-[220px] w-auto max-w-[150px] rounded-[16px] border border-primary-300/40 object-cover shadow-md md:h-[280px] md:max-w-[190px]"
                      style={{
                        marginLeft: i === 0 ? 0 : -36,
                        zIndex: isMiddle ? 2 : 1,
                        transform: `translateY(${yOffset}px)`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            <div className="mt-auto">
              {/* Pills (always above title, 12px spacing) */}
              {(type || skills.length > 0) && (
                <div className="mb-3 flex flex-wrap gap-2">
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
              )}

              {/* Title / location / description with 8px spacing */}
              <div className="flex flex-col gap-2">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-h1 font-bold text-primary-950 transition-opacity duration-200 focus:outline-none"
                    style={{ opacity: titleOpacity }}
                    onPointerEnter={() => setIsTitleHovered(true)}
                    onPointerLeave={() => setIsTitleHovered(false)}
                    onBlur={() => setIsTitleHovered(false)}
                  >
                    {page.title}
                  </a>
                ) : (
                  <h1 className="text-h1 font-bold text-primary-950">{page.title}</h1>
                )}

                {(location || dateRange) && (
                  <div className="flex items-center gap-2 text-body text-primary-950">
                    {location && <span>{location}</span>}
                    {location && dateRange && (
                      <span className="h-1 w-1 rounded-full bg-primary-300" />
                    )}
                    {dateRange && <span>{dateRange}</span>}
                  </div>
                )}

                {description && (
                  <p className="line-clamp-3 text-body text-primary-700 text-ellipsis">
                    {description}
                  </p>
                )}
              </div>
            </div>
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
                className="text-h1 font-bold text-primary-950 transition-opacity duration-200 focus:outline-none"
                style={{ opacity: titleOpacity }}
                onPointerEnter={() => setIsTitleHovered(true)}
                onPointerLeave={() => setIsTitleHovered(false)}
                onBlur={() => setIsTitleHovered(false)}
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
