"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({
  className = "",
  ariaLabel = "Toggle theme",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label={ariaLabel}
        className={`relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm transition active:scale-95 dark:border-zinc-700/60 dark:bg-zinc-900 ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={`group relative inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 dark:border-zinc-700/70 dark:bg-zinc-900/80 ${className}`}
    >
    
      {/* <span className="pointer-events-none absolute -inset-px rounded-[1.05rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(253,224,71,.35),rgba(0,0,0,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,.35),rgba(0,0,0,0))]" /> */}

      {/* Floating blob */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute h-24 w-24 rounded-full blur-2xl"
        initial={false}
        animate={{
          backgroundColor: isDark
            ? "rgba(59,130,246,0.25)"
            : "rgba(253,224,71,0.3)",
          scale: isDark ? 1.1 : 1.0,
          x: isDark ? 6 : -6,
          y: isDark ? 6 : -6,
          opacity: 0.65,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
      />

      {/* Icon container with subtle backdrop */}
      <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-white/5">
        <AnimatePresence initial={false} mode="wait">
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="flex"
            >
              <Sun className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="flex"
            >
              <Moon className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Focus ring */}
      <span className="absolute inset-0 rounded-2xl ring-0 ring-blue-500/0 transition group-focus-visible:ring-4 group-focus-visible:ring-blue-500/30" />
    </button>
  );
}
