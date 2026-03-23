"use client";
import { useState, useRef } from "react";
import { FeedImage } from "@/lib/types";

interface DraggableFeedGridProps {
  images: FeedImage[];
  onReorder: (newOrder: FeedImage[]) => void;
}

export default function DraggableFeedGrid({ images, onReorder }: DraggableFeedGridProps) {
  const [dragId, setDragId]   = useState<string | null>(null);
  const [overId, setOverId]   = useState<string | null>(null);
  const touchStartIdx         = useRef<number>(-1);
  const touchOverIdx          = useRef<number>(-1);

  /* ── Desktop drag & drop ── */
  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setOverId(id);
  }

  function onDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId) { reset(); return; }
    reorder(dragId, targetId);
    reset();
  }

  function onDragEnd() { reset(); }

  function reset() { setDragId(null); setOverId(null); }

  /* ── Touch drag (mobile) ── */
  function onTouchStart(idx: number) {
    touchStartIdx.current = idx;
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    const touch   = e.touches[0];
    const el      = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell    = el?.closest("[data-feedidx]") as HTMLElement | null;
    if (!cell) return;
    touchOverIdx.current = Number(cell.dataset.feedidx);
  }

  function onTouchEnd() {
    const from = touchStartIdx.current;
    const to   = touchOverIdx.current;
    if (from >= 0 && to >= 0 && from !== to) {
      const fromId = images[from]?.id;
      const toId   = images[to]?.id;
      if (fromId && toId) reorder(fromId, toId);
    }
    touchStartIdx.current = -1;
    touchOverIdx.current  = -1;
  }

  function reorder(fromId: string, toId: string) {
    const arr   = [...images];
    const fromI = arr.findIndex(f => f.id === fromId);
    const toI   = arr.findIndex(f => f.id === toId);
    if (fromI < 0 || toI < 0) return;
    const [item] = arr.splice(fromI, 1);
    arr.splice(toI, 0, item);
    onReorder(arr);
  }

  /* ── Render ── */
  const TOTAL = Math.max(9, Math.ceil((images.length + 1) / 3) * 3);
  const cells = Array.from({ length: TOTAL }, (_, i) => images[i] ?? null);

  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {cells.map((img, idx) => {
        if (!img) {
          return (
            <div key={`empty-${idx}`} className="aspect-square bg-[#efefef]" />
          );
        }
        const isDragging = dragId === img.id;
        const isOver     = overId === img.id && dragId !== img.id;

        return (
          <div
            key={img.id}
            data-feedidx={idx}
            draggable
            onDragStart={() => onDragStart(img.id)}
            onDragOver={e => onDragOver(e, img.id)}
            onDrop={e => onDrop(e, img.id)}
            onDragEnd={onDragEnd}
            onTouchStart={() => onTouchStart(idx)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`aspect-square relative overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
              isDragging ? "feed-cell-dragging" : ""
            } ${isOver ? "feed-cell-over" : ""}`}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
            />
            {/* Drag hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.8">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
