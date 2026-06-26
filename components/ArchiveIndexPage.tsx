import Link from "next/link";
import LiquidGlassHoverScope from "@/components/LiquidGlassHoverScope";

export type ArchiveEntry = {
  description?: string;
  href: string;
  id: string;
  meta?: string;
  title: string;
  year: string;
};

export type ArchiveSection = {
  description?: string;
  entries: ArchiveEntry[];
  id: string;
  title: string;
};

type ArchiveIndexPageProps = {
  description: string;
  itemLabel?: string;
  sections: ArchiveSection[];
  title: string;
};

function sortYearGroups([yearA]: [string, ArchiveEntry[]], [yearB]: [string, ArchiveEntry[]]) {
  const numberA = Number(yearA);
  const numberB = Number(yearB);

  if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
    return numberB - numberA;
  }

  return yearB.localeCompare(yearA);
}

function groupByYear(entries: ArchiveEntry[]) {
  const groups = new Map<string, ArchiveEntry[]>();

  for (const entry of entries) {
    const year = entry.year || "undated";
    groups.set(year, [...(groups.get(year) ?? []), entry]);
  }

  return Array.from(groups.entries()).sort(sortYearGroups);
}

function getYearAnchorId(year: string) {
  const slug = year.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `year-${slug || "undated"}`;
}

export default function ArchiveIndexPage({
  description,
  itemLabel = "entries",
  sections,
  title,
}: ArchiveIndexPageProps) {
  const totalCount = sections.reduce((count, section) => count + section.entries.length, 0);
  const entries = sections.flatMap((section) => section.entries);

  return (
    <main className="site-lowercase archive-page-shell">
      <article className="archive-page" aria-labelledby="archive-title">
        <LiquidGlassHoverScope>
          <nav className="archive-nav" aria-label="archive navigation">
            <Link href="/" className="archive-nav-link" data-liquid-glass-row="true">
              ↩ index
            </Link>
          </nav>

          <header className="archive-header">
            <h1 id="archive-title" className="archive-title">
              {title}
              <span>, {totalCount} {itemLabel}</span>
            </h1>
            <p className="archive-description">{description}</p>
          </header>

          <ol className="archive-year-list">
            {groupByYear(entries).map(([year, yearEntries]) => {
              const yearId = getYearAnchorId(year);

              return (
                <li key={year} id={yearId} className="archive-year-group">
                  <details className="archive-year-details" open>
                    <summary
                      aria-label={`${year}, ${yearEntries.length} ${itemLabel}`}
                      className="archive-year micro-focus micro-focus-tight"
                      data-liquid-glass-row="true"
                    >
                      <span className="archive-bullet-cell" aria-hidden="true">
                        <span className="archive-year-bullet" />
                        <span className="archive-caret">
                          <span />
                        </span>
                      </span>
                      <span className="archive-year-label">{year}</span>
                      <span className="archive-count">{yearEntries.length}</span>
                    </summary>

                    <ul className="archive-list">
                      {yearEntries.map((entry) => (
                        <li key={entry.id} className="archive-item">
                          <Link
                            href={entry.href}
                            className="archive-row micro-focus micro-focus-tight"
                            data-liquid-glass-row="true"
                          >
                            <span className="archive-bullet-cell" aria-hidden="true">
                              <span className="archive-row-bullet" />
                            </span>
                            <span className="archive-row-title">{entry.title}</span>
                            {entry.description && (
                              <span className="archive-row-description">{entry.description}</span>
                            )}
                            {entry.meta && <span className="archive-row-meta">{entry.meta}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ol>
        </LiquidGlassHoverScope>
      </article>
    </main>
  );
}
