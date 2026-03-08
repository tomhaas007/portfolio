const TOOL_LINKS = [
  {
    label: "notion",
    logoSrc: "/logos/notion.svg",
    href: "https://www.notion.so/2f905bfedda8804096cff8e03e39a8d9?v=31605bfedda880f0b02d000c97e59f59&source=copy_link",
  },
  {
    label: "figma",
    logoSrc: "/logos/figma.svg",
    href: "https://www.figma.com/design/vCnC3mySjPfVDsXitYkab6/personal_brand?node-id=1602-3096&t=wg5flzwnK12p6eaT-1",
  },
  {
    label: "codex",
    logoSrc: "/logos/codex.svg",
    href: "https://github.com/tomhaas007/portfolio?tab=readme-ov-file",
  },
];

export function FooterEasterEgg() {
  return (
    <p className="text-body text-primary-700">
      <span className="group relative inline-block align-baseline">
        <span className="inline-block transition-opacity duration-200 group-hover:opacity-60 group-focus-within:opacity-60">
          designed and built
        </span>
        <span className="pointer-events-none absolute bottom-full left-0 flex min-w-max flex-col gap-1 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          {TOOL_LINKS.map((tool, index) => (
            <a
              key={tool.label}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-primary-950 px-3 py-1 text-body text-primary-100 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 hover:bg-primary-950/60 focus-visible:bg-primary-950/60"
              style={{
                transitionDelay: `${index * 40}ms`,
              }}
            >
              {/* Placeholder logos live in /public/logos and can be replaced anytime. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.logoSrc}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 rounded-[3px]"
              />
              {tool.label}
            </a>
          ))}
        </span>
      </span>{" "}
      by myself in berlin, germany.
    </p>
  );
}
