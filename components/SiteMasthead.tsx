import Link from "next/link";
import CommandTriggerButton from "@/components/CommandTriggerButton";

type SiteMastheadProps = {
  className?: string;
  heading?: boolean;
  home?: boolean;
};

export default function SiteMasthead({ className = "", heading = false, home = false }: SiteMastheadProps) {
  const homeLink = (
    <Link
      href="/"
      aria-label="home"
      title="home"
      className="site-masthead__home micro-focus micro-focus-tight"
    >
      minwook shin
    </Link>
  );

  const mastheadClassName = [
    "site-masthead",
    home ? "site-masthead--home" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={mastheadClassName}>
      {heading ? (
        <h1 className="site-masthead__title">{homeLink}</h1>
      ) : (
        <span className="site-masthead__title">{homeLink}</span>
      )}
      <span className="site-masthead__command">
        <CommandTriggerButton className="site-masthead__command-button" />
        <span className="site-masthead__command-hint" aria-hidden="true">K</span>
      </span>
    </div>
  );
}
