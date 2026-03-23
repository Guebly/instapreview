export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  link: string;
  posts: string;
  followers: string;
  following: string;
  avatarUrl: string | null;
}

export interface Highlight {
  id: string;
  name: string;
  coverUrl: string | null;
}

export interface FeedImage {
  id: string;
  url: string;
}

export type Theme = "dark" | "light";
export type SidebarTab = "profile" | "highlights" | "feed";
