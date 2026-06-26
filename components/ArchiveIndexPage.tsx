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
          <Link href="/">↩ index</Link>
        </nav>

        <header className="archive-header">
          <h1 id="archive-title" className="archive-title">
            {title}
            <span>, {totalCount} {itemLabel}</span>
          </h1>
          <p className="archive-description">{description}</p>
        </header>

        <ol className="archive-year-list">
          {groupByYear(entries).map(([year, yearEntries]) => (
            <li key={year} className="archive-year-group">
              <div className="archive-year">
                <span className="archive-year-bullet" aria-hidden="true" />
                <span>{year}</span>
                <span>{yearEntries.length}</span>
              </div>

              <ul className="archive-list">
                {yearEntries.map((entry) => (
                  <li key={entry.id} className="archive-item">
                    <Link
                      href={entry.href}
                      className="archive-row micro-focus micro-focus-tight"
                      data-liquid-glass-row="true"
                    >
                      <span className="archive-row-title">{entry.title}</span>
                      {entry.description && (
                        <span className="archive-row-description">{entry.description}</span>
                      )}
                      {entry.meta && <span className="archive-row-meta">{entry.meta}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        </LiquidGlassHoverScope>
      </article>
    </main>
  );
}
