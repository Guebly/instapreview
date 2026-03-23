export interface ProfileData {
  username:    string;
  displayName: string;
  bio:         string;
  link:        string;
  posts:       string;
  followers:   string;
  following:   string;
  avatarUrl:   string | null;
  // extras
  verified:    boolean;
  category:    string;
  ctaLabel:    string;
  storyActive: boolean;
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

export type AppTheme = "dark"  | "light";
export type IgTheme  = "light" | "dark";
export type ViewMode = "mobile" | "desktop";
export type SidebarTab = "profile" | "highlights" | "feed";
