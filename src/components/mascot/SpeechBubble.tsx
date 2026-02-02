import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { SpeechBubbleProps } from "./types";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { typewriterVariants, letterVariants } from "./mrNewsVariants";

const STATUS_STYLES: Record<
  SpeechBubbleProps["status"],
  { dot: string; label: string }
> = {
  live: { dot: "bg-accent", label: "LIVE" },
  info: { dot: "bg-blue-400", label: "INFO" },
  warn: { dot: "bg-warn", label: "ALERT" },
  error: { dot: "bg-danger", label: "ERROR" },
};

const POSITION_STYLES: Record<
  NonNullable<SpeechBubbleProps["position"]>,
  string
> = {
  left: "before:right-full before:top-1/2 before:-translate-y-1/2 before:border-r-[rgb(var(--fg))] before:border-t-transparent before:border-b-transparent before:border-l-transparent before:border-[8px] before:mr-[-2px]",
  right:
    "before:left-full before:top-1/2 before:-translate-y-1/2 before:border-l-[rgb(var(--fg))] before:border-t-transparent before:border-b-transparent before:border-r-transparent before:border-[8px] before:ml-[-2px]",
  top: "before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-b-[rgb(var(--fg))] before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[8px] before:mb-[-2px]",
};

export function SpeechBubble({
  status,
  message,
  subtext,
  actions,
  position = "right",
  className,
}: SpeechBubbleProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const statusStyle = STATUS_STYLES[status];
  const positionStyle = POSITION_STYLES[position];

  const characters = message.split("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      className={clsx(
        "relative bg-card border-2 border-fg shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4",
        "before:absolute before:content-['']",
        positionStyle,
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/20">
        <div
          className={clsx(
            "w-2 h-2 rounded-full animate-pulse",
            statusStyle.dot,
          )}
        />
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
          MP // {statusStyle.label}
        </span>
      </div>

      {prefersReducedMotion ? (
        <p className="font-typewriter text-sm text-fg leading-relaxed">
          &ldquo;{message}&rdquo;
        </p>
      ) : (
        <motion.p
          className="font-typewriter text-sm text-fg leading-relaxed"
          variants={typewriterVariants}
          initial="hidden"
          animate="visible"
        >
          &ldquo;
          {characters.map((char, i) => (
            <motion.span key={i} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
          &rdquo;
        </motion.p>
      )}

      {subtext && (
        <p className="font-mono text-[10px] text-muted mt-2 uppercase">
          {subtext}
        </p>
      )}

      {actions && actions.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={clsx(
                "px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all",
                i === 0
                  ? "bg-fg text-bg hover:bg-accent hover:text-fg"
                  : "bg-transparent text-muted hover:text-fg hover:bg-bg border border-border/30",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
