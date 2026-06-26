import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

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
  eyebrow: string;
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
  eyebrow,
  sections,
  title,
}: ArchiveIndexPageProps) {
  const totalCount = sections.reduce((count, section) => count + section.entries.length, 0);

  return (
    <main className="site-lowercase archive-page-shell">
      <ThemeToggle />
      <article className="archive-page" aria-labelledby="archive-title">
        <nav className="archive-nav" aria-label="archive navigation">
          <Link href="/">index</Link>
          <Link href="/work">work</Link>
          <Link href="/studies">studies</Link>
        </nav>

        <header className="archive-header">
          <p className="archive-eyebrow">{eyebrow}</p>
          <h1 id="archive-title" className="archive-title">
            {title}
            <span>{totalCount}</span>
          </h1>
          <p className="archive-description">{description}</p>
        </header>

        <div className="archive-sections">
          {sections.map((section) => (
            <section key={section.id} className="archive-section" aria-labelledby={`${section.id}-title`}>
              <header className="archive-section-header">
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                {section.description && <p>{section.description}</p>}
              </header>

              <div className="archive-year-groups">
                {groupByYear(section.entries).map(([year, entries]) => (
                  <div key={`${section.id}-${year}`} className="archive-year-group">
                    <div className="archive-year">
                      <span>{year}</span>
                      <span>{entries.length}</span>
                    </div>

                    <ul className="archive-list">
                      {entries.map((entry) => (
                        <li key={entry.id} className="archive-item">
                          <Link href={entry.href} className="archive-row micro-focus micro-focus-tight">
                            <span className="archive-row-bullet" aria-hidden="true" />
                            <span className="archive-row-body">
                              <span className="archive-row-line">
                                <span className="archive-row-title">{entry.title}</span>
                                {entry.meta && <span className="archive-row-meta">{entry.meta}</span>}
                              </span>
                              {entry.description && (
                                <span className="archive-row-description">{entry.description}</span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
