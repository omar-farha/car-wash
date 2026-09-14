"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { beforeAfterPhoto } from "@/lib/stock-photos";

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(96, Math.max(4, ratio)));
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") setPercent((p) => Math.max(4, p - 5));
    if (e.key === "ArrowRight") setPercent((p) => Math.min(96, p + 5));
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-[1.75rem] shadow-pop ring-1 ring-black/5 sm:aspect-[16/9]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* after: full vivid image */}
      <Image
        src={beforeAfterPhoto.src}
        alt={beforeAfterPhoto.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        draggable={false}
      />
      <span className="absolute bottom-4 left-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        بعد
      </span>

      {/* before: desaturated/dulled clip of the same scene */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <div className="relative h-full w-full">
          <Image
            src={beforeAfterPhoto.src}
            alt="قبل الغسيل — قبل الخدمة"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover grayscale-[55%] contrast-75 brightness-[0.72] saturate-[0.7]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-ink-900/10" />
        </div>
        <span className="absolute bottom-4 right-4 rounded-full bg-ink-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          قبل
        </span>
      </div>

      {/* handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white/90"
        style={{ left: `${percent}%` }}
      >
        <button
          type="button"
          aria-label="حرّك للمقارنة بين قبل وبعد"
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-ink-700 shadow-pop ring-4 ring-white/40 focus-visible:outline-none focus-visible:ring-brand-500"
        >
          <MoveHorizontal className="size-5" />
        </button>
      </div>
    </div>
  );
}
