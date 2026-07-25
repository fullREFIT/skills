// full/REFIT Presentation Site System — content schema.
// The renderer consumes a validated Report only. Content (JSON) and presentation
// (renderer) are fully separated so any topic can be regenerated programmatically.

export type PresentationMode = 'presenter' | 'reader';
export type ItemClass = 'hidden' | 'ranked' | 'sponsor' | 'appendix';
export type ItemLayer = 'systems' | 'teams' | 'neutral';
export type StatEmphasis = 'neutral' | 'red' | 'gold';
export type SourceType = 'github' | 'docs' | 'tweet' | 'youtube' | 'issue' | 'article' | 'other';
export type VerdictState = 'USE' | 'WATCH' | 'IGNORE' | 'REPLICATE' | 'TEST';
export type VerdictEffort = 'LOW' | 'MEDIUM' | 'HIGH';
export type TabType =
  | 'summary'
  | 'source'
  | 'proof'
  | 'tweet'
  | 'video'
  | 'controversy'
  | 'mechanics'
  | 'decision'
  | 'further-reading';

export interface Report {
  version: string;
  slug: string;
  title: string;
  subtitle?: string;
  topic: string;
  date: string;
  brand: BrandConfig;
  modeDefaults?: ModeDefaults;
  intro: IntroSlide;
  methodology?: MethodologySlide;
  items: ReportItem[];
  closing?: ClosingSlide;
  seo?: SeoConfig;
}

export interface BrandConfig {
  name: 'full/REFIT';
  theme: 'carbon-forge';
  wordmark: {
    fullText: 'full/REFIT';
    slashColor: string;
    tagline?: string;
  };
}

export interface ModeDefaults {
  defaultMode: PresentationMode;
  showHelpHint: boolean;
  showProgressRail: boolean;
}

export interface IntroSlide {
  label: string;
  title: string;
  subtitle?: string;
  summary: string;
  proofStats?: StatBlock[];
  tags?: string[];
}

export interface MethodologySlide {
  label: string;
  title: string;
  body: string[];
}

export interface ClosingSlide {
  label: string;
  title: string;
  body: string[];
  cta?: Cta;
}

export interface ReportItem {
  id: string;
  rankLabel: string;
  itemClass: ItemClass;
  category: string;
  layer: ItemLayer;
  title: string;
  headline: string;
  thesis: string;
  whyLabel: string;
  whyBody: string;
  takeaway: string;
  verdict?: VerdictBlock;
  stats?: StatBlock[];
  highlights?: HighlightBlock[];
  sources: SourceLink[];
  tags?: string[];
  tabs: ItemTab[];
  furtherReading?: SourceLink[];
}

export interface StatBlock {
  label: string;
  value: string;
  emphasis?: StatEmphasis;
}

export interface HighlightBlock {
  title: string;
  body: string;
}

export interface SourceLink {
  label: string;
  url: string;
  domain?: string;
  type?: SourceType;
}

export interface VerdictBlock {
  state: VerdictState;
  fit: string;
  effort: VerdictEffort;
  whyNow: string;
  risks?: string[];
  nextStep?: string;
}

export interface ItemTab {
  id: string;
  type: TabType;
  label: string;
  title?: string;
  body?: string | string[];
  embed?: EmbedBlock;
  stats?: StatBlock[];
  highlights?: HighlightBlock[];
  links?: SourceLink[];
}

export interface EmbedBlock {
  kind: 'tweet' | 'youtube' | 'github-card' | 'image' | 'html';
  url?: string;
  html?: string;
  thumbnailUrl?: string;
  timestampLabel?: string;
}

export interface Cta {
  label: string;
  url: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  ogImage?: string;
}

// Resolved navigation state. cover/methodology/closing are report-level frames
// that use their own id as the tab id.
export interface RouteState {
  itemId: string;
  tabId: string;
  mode: PresentationMode;
  focusMode: boolean;
}
