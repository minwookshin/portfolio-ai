import Link from "next/link";
import CommandTriggerButton from "@/components/CommandTriggerButton";
import { OutlineSignalCell } from "@/components/Outline";

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
  const archiveKind = itemLabel === "notes" ? "notes" : itemLabel === "systems" ? "systems" : "work";
  const rowUsesSignal = archiveKind !== "notes";

  return (
    <main className="site-lowercase archive-page-shell">
      <article className="archive-page" data-archive-kind={archiveKind} aria-labelledby="archive-title">
        <nav className="archive-nav" aria-label="archive navigation">
          <div className="archive-root-row">
            <Link href="/" aria-label="home" title="home" className="archive-root-link">
              minwook shin
            </Link>
            <CommandTriggerButton />
          </div>
        </nav>

        <div className="archive-document-content document-content-boot">
          <header className="archive-header">
            <div className="archive-section-row">
              <OutlineSignalCell
                cellClassName="archive-bullet-cell"
                dotClassName="archive-section-bullet"
              />
              <div className="archive-section-copy">
                <h1 id="archive-title" className="archive-title">
                  {title}
                  <span className="sr-only">, {totalCount} {itemLabel}</span>
                </h1>
                {description && <p className="archive-description">{description}</p>}
              </div>
            </div>
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
                    >
                      <OutlineSignalCell
                        arrow="both"
                        arrowClassName="archive-caret"
                        cellClassName="archive-bullet-cell"
                        dotClassName="archive-year-bullet"
                      />
                      <span className="archive-year-label">{year}</span>
                      <span className="archive-count">{yearEntries.length}</span>
                    </summary>

                    <ul className="archive-list">
                      {yearEntries.map((entry) => (
                        <li key={entry.id} className="archive-item">
                          <Link
                            href={entry.href}
                            className={`archive-row${rowUsesSignal ? "" : " archive-row--quiet"} micro-focus micro-focus-tight`}
                          >
                            <OutlineSignalCell
                              arrow={rowUsesSignal ? "right" : undefined}
                              arrowClassName="archive-row-signal"
                              cellClassName="archive-bullet-cell"
                              dotClassName="archive-row-bullet"
                              rightArrowClassName="site-signal-icon"
                            />
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
        </div>
      </article>
    </main>
  );
}
