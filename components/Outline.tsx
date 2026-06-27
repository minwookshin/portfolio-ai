import type { ElementType, ReactNode } from "react";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";

type OutlineSignalCellProps = {
  arrow?: "both" | "down" | "right";
  arrowClassName?: string;
  cellClassName?: string;
  dotClassName?: string;
  rightArrowClassName?: string;
  downArrowClassName?: string;
};

export function OutlineSignalCell({
  arrow,
  arrowClassName = "",
  cellClassName = "detail-outline-bullet-cell",
  dotClassName = "detail-outline-bullet",
  downArrowClassName = "site-signal-icon site-signal-icon--down",
  rightArrowClassName = "site-signal-icon site-signal-icon--right",
}: OutlineSignalCellProps) {
  return (
    <span className={cellClassName} aria-hidden="true">
      <span className={dotClassName} />
      {arrow && (
        <span className={arrowClassName}>
          {(arrow === "right" || arrow === "both") && <MaterialArrowForwardIcon className={rightArrowClassName} />}
          {(arrow === "down" || arrow === "both") && <MaterialArrowForwardIcon className={downArrowClassName} />}
        </span>
      )}
    </span>
  );
}

type DetailOutlineHeadingProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  headingAs?: ElementType;
  headingClassName?: string;
};

export function DetailOutlineHeading({
  eyebrow,
  heading,
  headingAs: Heading = "h2",
  headingClassName = "text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]",
}: DetailOutlineHeadingProps) {
  return (
    <div className="detail-outline-heading-row">
      <OutlineSignalCell dotClassName="detail-outline-bullet detail-outline-bullet--section" />
      <div className="detail-outline-heading-copy">
        <Heading className={headingClassName}>{heading}</Heading>
        {eyebrow && (
          <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">
            {eyebrow}
          </p>
        )}
      </div>
    </div>
  );
}

type DetailOutlineRowProps = {
  body?: ReactNode;
  bodyClassName?: string;
  children?: ReactNode;
  className?: string;
  meta?: ReactNode;
  title?: ReactNode;
};

export function DetailOutlineRow({
  body,
  bodyClassName = "",
  children,
  className = "",
  meta,
  title,
}: DetailOutlineRowProps) {
  return (
    <div className={`detail-outline-row ${className}`}>
      <OutlineSignalCell />
      <div className="detail-outline-row-copy">
        {(title || meta) && (
          <p className="detail-outline-row-line">
            {title && <span className="detail-outline-row-title">{title}</span>}
            {meta && <span className="detail-outline-row-meta">{meta}</span>}
          </p>
        )}
        {body && <p className={`detail-outline-row-body ${bodyClassName}`}>{body}</p>}
        {children}
      </div>
    </div>
  );
}
