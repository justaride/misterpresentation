import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import type { MrNewsProps, MrNewsExpression, MrNewsPose } from "./types";
import { STATE_MAPPING } from "./types";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import {
  MOUTH_PATHS,
  BROW_TRANSFORMS,
  EYE_VARIANTS,
  ARM_TRANSFORMS,
  idleAnimation,
  scanAnimation,
  radarPingAnimation,
} from "./mrNewsVariants";

export function MrNews({
  size = 64,
  expression: expressionProp,
  pose: poseProp,
  state,
  animated = true,
  className,
}: MrNewsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const expression: MrNewsExpression = state
    ? STATE_MAPPING[state].expression
    : (expressionProp ?? "neutral");

  const pose: MrNewsPose = state
    ? STATE_MAPPING[state].pose
    : (poseProp ?? "idle");

  const eyeStyle = EYE_VARIANTS[expression];
  const browStyle = BROW_TRANSFORMS[expression];
  const armStyle = ARM_TRANSFORMS[pose];
  const mouthPath = MOUTH_PATHS[expression];

  const transitionConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Mister Presentations mascot - ${expression} expression, ${pose} pose`}
      className={clsx("select-none", className)}
      animate={shouldAnimate && pose === "idle" ? idleAnimation : undefined}
    >
      <g id="antenna">
        <line
          x1="50"
          y1="8"
          x2="50"
          y2="18"
          stroke="rgb(var(--fg))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.circle
          cx="50"
          cy="6"
          r="4"
          fill="rgb(var(--accent))"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
          animate={shouldAnimate ? radarPingAnimation : undefined}
        />
      </g>

      <g id="body-group">
        <rect
          x="25"
          y="20"
          width="50"
          height="55"
          rx="8"
          fill="rgb(var(--card))"
          stroke="rgb(var(--fg))"
          strokeWidth="3"
        />

        <rect
          x="30"
          y="25"
          width="40"
          height="35"
          rx="4"
          fill="rgb(var(--bg))"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
        />

        <g id="face">
          <motion.ellipse
            cx="40"
            cy="40"
            rx="5"
            ry="6"
            fill="rgb(var(--fg))"
            animate={{
              scaleY: eyeStyle.scaleY,
              y: eyeStyle.y,
            }}
            transition={transitionConfig}
            style={{ originX: "40px", originY: "40px" }}
          />

          <motion.ellipse
            cx="60"
            cy="40"
            rx="5"
            ry="6"
            fill="rgb(var(--fg))"
            animate={{
              scaleY: eyeStyle.scaleY,
              y: eyeStyle.y,
            }}
            transition={transitionConfig}
            style={{ originX: "60px", originY: "40px" }}
          />

          <motion.line
            x1="34"
            y1="32"
            x2="46"
            y2="32"
            stroke="rgb(var(--fg))"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ transform: browStyle.left }}
            transition={transitionConfig}
            style={{ originX: "40px", originY: "32px" }}
          />

          <motion.line
            x1="54"
            y1="32"
            x2="66"
            y2="32"
            stroke="rgb(var(--fg))"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ transform: browStyle.right }}
            transition={transitionConfig}
            style={{ originX: "60px", originY: "32px" }}
          />

          <AnimatePresence mode="wait">
            <motion.path
              key={expression}
              d={mouthPath}
              fill="none"
              stroke="rgb(var(--fg))"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            />
          </AnimatePresence>
        </g>

        <defs>
          <clipPath id="badge-clip">
            <rect x="39" y="63" width="22" height="8" rx="1" />
          </clipPath>
        </defs>
        <rect
          x="38"
          y="62"
          width="24"
          height="10"
          rx="2"
          fill="rgb(var(--fg))"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
        />
        <rect
          x="39"
          y="63"
          width="22"
          height="8"
          rx="1"
          fill="rgb(var(--bg))"
        />
        <g clipPath="url(#badge-clip)">
          <motion.text
            y="69.5"
            fontSize="5"
            fontWeight="bold"
            fontFamily="var(--font-mono)"
            fill="rgb(var(--accent))"
            initial={{ x: 62 }}
            animate={shouldAnimate ? { x: [62, -10] } : { x: 30 }}
            transition={
              shouldAnimate
                ? { duration: 6, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
          >
            MISTER PRESENTATIONS
          </motion.text>
        </g>

        <motion.g
          id="left-arm"
          animate={{ transform: armStyle.leftArm }}
          transition={transitionConfig}
          style={{ originX: "25px", originY: "45px" }}
        >
          <rect
            x="12"
            y="40"
            width="15"
            height="8"
            rx="3"
            fill="rgb(var(--card))"
            stroke="rgb(var(--fg))"
            strokeWidth="2"
          />
          <circle
            cx="14"
            cy="44"
            r="4"
            fill="rgb(var(--card))"
            stroke="rgb(var(--fg))"
            strokeWidth="2"
          />
        </motion.g>

        <motion.g
          id="right-arm"
          animate={{
            transform: armStyle.rightArm,
            ...(shouldAnimate && pose === "scan" ? scanAnimation : {}),
          }}
          transition={transitionConfig}
          style={{ originX: "75px", originY: "45px" }}
        >
          <rect
            x="73"
            y="40"
            width="15"
            height="8"
            rx="3"
            fill="rgb(var(--card))"
            stroke="rgb(var(--fg))"
            strokeWidth="2"
          />
          <circle
            cx="86"
            cy="44"
            r="4"
            fill="rgb(var(--card))"
            stroke="rgb(var(--fg))"
            strokeWidth="2"
          />

          {pose === "scan" && (
            <g transform="translate(82, 30)">
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="none"
                stroke="rgb(var(--fg))"
                strokeWidth="2"
              />
              <line
                x1="4"
                y1="4"
                x2="9"
                y2="9"
                stroke="rgb(var(--fg))"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}

          {pose === "stamp" && (
            <g transform="translate(80, 25)">
              <rect
                x="0"
                y="0"
                width="10"
                height="14"
                rx="1"
                fill="rgb(var(--card))"
                stroke="rgb(var(--fg))"
                strokeWidth="1.5"
              />
              <line
                x1="2"
                y1="4"
                x2="8"
                y2="4"
                stroke="rgb(var(--fg))"
                strokeWidth="1"
              />
              <line
                x1="2"
                y1="7"
                x2="8"
                y2="7"
                stroke="rgb(var(--fg))"
                strokeWidth="1"
              />
              <line
                x1="2"
                y1="10"
                x2="6"
                y2="10"
                stroke="rgb(var(--fg))"
                strokeWidth="1"
              />
            </g>
          )}
        </motion.g>

        <rect
          x="32"
          y="75"
          width="12"
          height="10"
          rx="2"
          fill="rgb(var(--card))"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
        />
        <rect
          x="56"
          y="75"
          width="12"
          height="10"
          rx="2"
          fill="rgb(var(--card))"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
        />

        <rect
          x="30"
          y="85"
          width="16"
          height="6"
          rx="2"
          fill="rgb(var(--fg))"
        />
        <rect
          x="54"
          y="85"
          width="16"
          height="6"
          rx="2"
          fill="rgb(var(--fg))"
        />
      </g>
    </motion.svg>
  );
}
