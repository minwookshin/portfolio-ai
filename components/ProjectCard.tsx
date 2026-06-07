export interface ProjectContentSection {
  type: 'text' | 'gallery' | 'video';
  content?: string;
  images?: { image: string; caption: string; span?: string | number }[];
  url?: string;
  caption?: string;
  aspectRatio?: string;
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  categories?: string[];
  link?: string;
  github?: string;
  linkedin?: string;
  date: string;
  image?: string;
  icon?: string;
  /** Text/emoji shown in the app-icon tile when there's no image icon. */
  glyph?: string;
  /** Short studio-style label shown on the project tile. */
  studioLabel?: string;
  /** Keeps the tile visible while preventing the detail view from opening. */
  comingSoon?: boolean;
  unavailableMessage?: string;
  role?: string;
  timeline?: string;
  overview?: string;
  features?: string[];
  challenges?: string;
  outcome?: string;
  themeColor?: string;
  contentSections?: ProjectContentSection[];
  team?: string;
  gallery?: string[];
}
