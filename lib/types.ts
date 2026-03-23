export interface BioLink {
  id:    string;
  label: string;
  url:   string;
}

export interface ProfileData {
  username:    string;
  displayName: string;
  bio:         string;
  link:        string;       // legacy single link (still used as primary)
  bioLinks:    BioLink[];    // new: up to 5 links
  posts:       string;       // auto-synced with feed.length when autoCount=true
  autoCount:   boolean;      // sync post count automatically
  followers:   string;
  following:   string;
  avatarUrl:   string | null;
  verified:    "none" | "blue" | "gold";  // none / Meta blue / Meta gold
  category:    string;
  ctaLabel:    string;
  storyActive: boolean;
  viewMode:    "owner" | "visitor";  // whose POV the preview shows
}

export interface Highlight {
  id:       string;
  name:     string;
  coverUrl: string | null;
}

export interface FeedImage {
  id:     string;
  url:    string;
  pinned: boolean;
}

export type AppTheme  = "dark"  | "light";
export type IgTheme   = "light" | "dark";
export type DeviceView = "mobile" | "desktop";
export type SidebarTab = "profile" | "highlights" | "feed";
