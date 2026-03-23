"use client";
import { ProfileData, Highlight, FeedImage } from "@/lib/types";
import DraggableFeedGrid from "./DraggableFeedGrid";

interface PhonePreviewProps {
  profile: ProfileData;
  highlights: Highlight[];
  feed: FeedImage[];
  onFeedReorder: (f: FeedImage[]) => void;
}

export default function PhonePreview({
  profile, highlights, feed, onFeedReorder,
}: PhonePreviewProps) {
  const hasAvatar = !!profile.avatarUrl;

  return (
    <div className="phone-shadow w-[375px] flex-shrink-0 bg-white rounded-[44px] border-[8px] border-[#2a2a2a] overflow-hidden" style={{ outline: "1px solid #444" }}>

      {/* Notch */}
      <div className="relative bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#2a2a2a] rounded-b-[20px] z-10" />
        <div className="pt-8">

          {/* IG Top Bar */}
          <div className="ig-font flex items-center justify-between px-4 py-2 border-b border-[#dbdbdb]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span className="text-[15px] font-bold text-[#262626] tracking-tight">
              {profile.username || "seu_usuario"}
            </span>
            <div className="flex items-center gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.8">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5"  y1="12" x2="19" y2="12"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.8">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="ig-font px-4 pt-4">
            {/* Avatar + Stats */}
            <div className="flex items-center gap-6 mb-3">
              {/* Avatar ring */}
              <div className={`w-[86px] h-[86px] rounded-full p-[3px] flex-shrink-0 ${hasAvatar ? "ig-gradient" : "bg-[#dbdbdb]"}`}>
                <div className="w-full h-full rounded-full border-2 border-white bg-[#efefef] overflow-hidden flex items-center justify-center">
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    : <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  }
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-1 justify-around">
                {[
                  { val: profile.posts,     label: "publicações" },
                  { val: profile.followers, label: "seguidores"  },
                  { val: profile.following, label: "seguindo"    },
                ].map(({ val, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-[17px] font-bold text-[#262626] leading-tight">
                      {val || "0"}
                    </span>
                    <span className="text-[12px] text-[#262626]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-3">
              {profile.displayName && (
                <p className="text-[14px] font-bold text-[#262626] leading-snug">
                  {profile.displayName}
                </p>
              )}
              {profile.bio && (
                <p className="text-[13px] text-[#262626] whitespace-pre-line leading-[1.45] mt-0.5">
                  {profile.bio}
                </p>
              )}
              {profile.link && (
                <p className="text-[13px] font-semibold text-[#00376b] mt-0.5">
                  {profile.link}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 mb-3">
              <button className="flex-1 py-[6px] text-[13px] font-semibold rounded-lg bg-[#efefef] border border-[#dbdbdb] text-[#262626]">
                Editar perfil
              </button>
              <button className="flex-1 py-[6px] text-[13px] font-semibold rounded-lg bg-[#efefef] border border-[#dbdbdb] text-[#262626]">
                Compartilhar
              </button>
              <button className="py-[6px] px-2.5 text-[13px] font-semibold rounded-lg bg-[#efefef] border border-[#dbdbdb] text-[#262626]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M16 21v-2a4 4 0 00-8 0v2"/>
                  <circle cx="12" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Highlights ── */}
          {highlights.length > 0 && (
            <div className="ig-font flex gap-4 px-4 pb-4 overflow-x-auto border-b border-[#dbdbdb]" style={{ scrollbarWidth: "none" }}>
              {highlights.map(h => (
                <div key={h.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-[62px] h-[62px] rounded-full border border-[#dbdbdb] p-[2px] bg-white">
                    <div className="w-full h-full rounded-full bg-[#efefef] overflow-hidden flex items-center justify-center text-[22px]">
                      {h.coverUrl
                        ? <img src={h.coverUrl} alt="" className="w-full h-full object-cover" />
                        : <span className="text-[#ccc] text-[18px]">○</span>
                      }
                    </div>
                  </div>
                  <span className="text-[11px] text-[#262626] max-w-[62px] text-center overflow-hidden text-ellipsis whitespace-nowrap font-normal" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                    {h.name || "Destaque"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Feed Tabs ── */}
          <div className="flex border-b border-[#dbdbdb]">
            {[
              /* Grid icon */
              <svg key="grid" width="22" height="22" viewBox="0 0 24 24" fill="#262626">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>,
              /* Reels icon */
              <svg key="reels" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.6">
                <rect x="2" y="2" width="20" height="20" rx="4"/>
                <circle cx="12" cy="12" r="3.5"/>
                <circle cx="6.5" cy="6.5" r="1.2" fill="#999"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="#999"/>
              </svg>,
              /* Tagged icon */
              <svg key="tag" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.6">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                <circle cx="7" cy="7" r="1.5" fill="#999"/>
              </svg>,
            ].map((icon, i) => (
              <div key={i} className={`flex-1 py-2.5 flex items-center justify-center border-b-2 ${i === 0 ? "border-[#262626]" : "border-transparent"}`}>
                {icon}
              </div>
            ))}
          </div>

          {/* ── Feed Grid (drag & drop) ── */}
          <DraggableFeedGrid images={feed} onReorder={onFeedReorder} />

        </div>
      </div>
    </div>
  );
}
