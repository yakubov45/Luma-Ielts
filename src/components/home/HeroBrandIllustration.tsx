"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Sparkles, BookOpen, Zap } from "lucide-react";

export function HeroBrandIllustration() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user's system preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setIsPlaying(false);
      videoRef.current?.pause();
    }
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) {
        setIsPlaying(false);
        videoRef.current?.pause();
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Ambient background glow behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--primary)]/15 via-amber-500/10 to-orange-400/5 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main bounded illustration container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl shadow-[0_12px_40px_rgba(194,65,12,0.08)] aspect-[4/3] sm:aspect-[16/11] max-h-[280px] sm:max-h-[320px] flex items-center justify-center group">
        
        {/* Looping 3D video animation */}
        <video
          ref={videoRef}
          autoPlay={!reducedMotion}
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="w-full h-full object-cover dark:brightness-[0.75] dark:contrast-[1.1] transition-opacity duration-500"
        >
          <source src="/videos/auth-desktop.mp4" type="video/mp4" />
        </video>

        {/* Soft overlay gradient to blend with the card edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 dark:from-black/40 dark:via-transparent dark:to-black/20 pointer-events-none" />

        {/* Top-left floating badge */}
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/60 dark:border-white/10 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Cambridge Mocklar</span>
        </div>

        {/* Bottom-right floating badge */}
        <div className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/60 dark:border-white/10 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Tezkor AI Tahlil</span>
        </div>

        {/* Accessible Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Animatsiyani to‘xtatish" : "Animatsiyani yoqish"}
          title={isPlaying ? "Animatsiyani to‘xtatish" : "Animatsiyani yoqish"}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/60 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-[var(--primary)] transition-all cursor-pointer opacity-80 group-hover:opacity-100 shadow-xs"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
