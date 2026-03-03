"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getCardDisplayProps, type NotionPage } from "@/lib/card-props";

type PortfolioCardProps = {
  page: NotionPage;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onRequestExpand: () => void;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  if (y && m) return `${m}/${y}`;
  return iso;
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px] translate-y-[1px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px] translate-y-[1px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PortfolioCard({
  page,
  isExpanded,
  onToggleExpanded,
  onRequestExpand,
}: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setIsCoarsePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

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

  const clampedImageIndex = Math.min(activeImageIndex, Math.max(images.length - 1, 0));
  const activeImage = images[clampedImageIndex] ?? null;
  const canGoPrev = clampedImageIndex > 0;
  const canGoNext = clampedImageIndex < images.length - 1;
  const shouldShowRichState = hasHoverContent && (isHovered || isExpanded || isCoarsePointer);
  const titleOpacity = isTitleHovered ? 0.6 : 1;
  const shadow = isExpanded
    ? "0 8px 28px 24px rgba(25, 25, 25, 0.06)"
    : isHovered
      ? "0 4px 24px 24px rgba(25, 25, 25, 0.04)"
      : "none";
  const cardWidth = useMemo(
    () => (isExpanded ? "min(88vw, calc(100vw - 72px))" : undefined),
    [isExpanded]
  );

  const handleExpandToggle = () => {
    if (isExpanded) {
      setActiveImageIndex(0);
      onToggleExpanded();
      return;
    }
    setActiveImageIndex(0);
    onRequestExpand();
  };

  return (
    <motion.article
      layout
      transition={{
        layout: {
          duration: 0.68,
          ease: [0.68, -0.6, 0.32, 1.6],
        },
      }}
      className="relative flex h-full w-[320px] flex-shrink-0 flex-col overflow-hidden rounded-[24px] border-0 bg-primary-100 p-6 outline-none transition-shadow duration-300 focus:outline-none md:w-[420px]"
      style={{
        boxShadow: shadow,
        width: cardWidth,
      }}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        if (!isExpanded && !isCoarsePointer) {
          setIsHovered(false);
        }
        setIsTitleHovered(false);
      }}
    >
      <AnimatePresence mode="wait">
        {shouldShowRichState ? (
          <motion.div
            key={isExpanded ? "expanded" : "hover"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isExpanded ? 0.68 : 0.36,
              ease: isExpanded ? [0.68, -0.6, 0.32, 1.6] : "easeInOut",
            }}
            className={`flex h-full min-h-0 flex-1 flex-col ${isExpanded ? "gap-4" : "justify-between"}`}
          >
            {isExpanded ? (
              <div className="flex min-h-0 flex-1 flex-col gap-5 md:flex-row md:gap-8">
                {activeImage && (
                  <div className="relative flex min-h-[220px] items-center justify-start md:min-h-0 md:w-[42%] md:flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeImage}
                      alt={`${page.title} image ${clampedImageIndex + 1}`}
                      className="h-[220px] w-full max-h-full object-contain md:h-full md:min-h-[280px]"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Show previous image"
                          disabled={!canGoPrev}
                          onClick={() =>
                            setActiveImageIndex(() => Math.max(0, clampedImageIndex - 1))
                          }
                          className="absolute bottom-2 left-2 z-10 inline-flex cursor-pointer items-center gap-1 leading-none text-body text-primary-950 transition-colors transition-opacity hover:text-primary-700 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-950 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-primary-950"
                        >
                          <ArrowLeftIcon />
                          <span>previous</span>
                        </button>
                        <button
                          type="button"
                          aria-label="Show next image"
                          disabled={!canGoNext}
                          onClick={() =>
                            setActiveImageIndex(() =>
                              Math.min(images.length - 1, clampedImageIndex + 1)
                            )
                          }
                          className="absolute right-2 bottom-2 z-10 inline-flex cursor-pointer items-center gap-1 leading-none text-body text-primary-950 transition-colors transition-opacity hover:text-primary-700 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-950 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-primary-950"
                        >
                          <span>next</span>
                          <ArrowRightIcon />
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="min-h-0 flex-1 md:self-end">
                  <div className="h-full min-h-0 flex-1 overflow-y-auto pr-1">
                    {/* Pills (always above title, 12px spacing) */}
                    {(type || skills.length > 0) && (
                      <div className="mb-3 flex flex-wrap gap-1">
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
                    <div className="flex min-h-0 flex-1 flex-col gap-3">
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
                        <p className="text-body text-primary-700">{description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              images.length > 0 && (
                <div className="flex min-h-[220px] shrink-0 items-start justify-start pb-4 md:min-h-[280px]">
                  {images.map((src, i) => {
                    const rotation = i === 1 ? "4deg" : i === 2 ? "8deg" : "0deg";
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        // Remote image URLs come from Notion and are rendered as-is.
                        key={i}
                        src={src}
                        alt=""
                        className="h-[240px] w-auto max-h-full max-w-full object-contain md:h-[300px]"
                        style={{
                          marginLeft: i === 0 ? 0 : -36,
                          zIndex: i + 1,
                          transform: `rotate(${rotation})`,
                        }}
                      />
                    );
                  })}
                </div>
              )
            )}

            {!isExpanded && (
              <div className="mt-auto">
                {/* Pills (always above title, 12px spacing) */}
                {(type || skills.length > 0) && (
                  <div className="mb-3 flex flex-wrap gap-1">
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
            )}
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: "easeInOut" }}
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
      {shouldShowRichState && (
        <button
          type="button"
          aria-label={isExpanded ? "Collapse card" : "Expand card"}
          onClick={(event) => {
            event.stopPropagation();
            handleExpandToggle();
          }}
          className="absolute right-5 bottom-5 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary-950 text-primary-100 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-950"
        >
          {/* Loaded from public/icons so replacing the files updates the button icon. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isExpanded ? "/icons/collapse.svg" : "/icons/expand.svg"}
            alt=""
            aria-hidden="true"
            className="h-[13px] w-[13px]"
          />
        </button>
      )}
    </motion.article>
  );
}
