import type { Variants, Transition } from "framer-motion";
import type { MrNewsExpression, MrNewsPose } from "./types";

export const MOUTH_PATHS: Record<MrNewsExpression, string> = {
  neutral: "M35,68 Q50,73 65,68",
  excited: "M35,65 Q50,78 65,65",
  thinking: "M40,68 Q50,66 60,68",
  concerned: "M35,72 Q50,65 65,72",
  proud: "M35,66 Q50,75 65,66",
  confidential: "M35,70 Q50,70 65,70",
};

export const BROW_TRANSFORMS: Record<
  MrNewsExpression,
  { left: string; right: string }
> = {
  neutral: { left: "rotate(0)", right: "rotate(0)" },
  excited: { left: "rotate(-8deg)", right: "rotate(8deg)" },
  thinking: { left: "rotate(-12deg)", right: "rotate(0)" },
  concerned: { left: "rotate(8deg)", right: "rotate(-8deg)" },
  proud: { left: "rotate(-5deg)", right: "rotate(5deg)" },
  confidential: { left: "rotate(0)", right: "rotate(0)" },
};

export const EYE_VARIANTS: Record<
  MrNewsExpression,
  { scaleY: number; y: number }
> = {
  neutral: { scaleY: 1, y: 0 },
  excited: { scaleY: 1.1, y: -1 },
  thinking: { scaleY: 0.8, y: 1 },
  concerned: { scaleY: 0.9, y: 0 },
  proud: { scaleY: 1, y: 0 },
  confidential: { scaleY: 0.5, y: 2 },
};

export const ARM_TRANSFORMS: Record<
  MrNewsPose,
  { leftArm: string; rightArm: string }
> = {
  idle: { leftArm: "rotate(0)", rightArm: "rotate(0)" },
  point: { leftArm: "rotate(0)", rightArm: "rotate(-45deg) translateX(5px)" },
  scan: { leftArm: "rotate(15deg)", rightArm: "rotate(-15deg)" },
  stamp: { leftArm: "rotate(0)", rightArm: "rotate(-90deg) translateY(-5px)" },
  shrug: { leftArm: "rotate(30deg)", rightArm: "rotate(-30deg)" },
  whisper: { leftArm: "rotate(0)", rightArm: "rotate(-20deg) translateX(2px)" },
};

const _springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const expressionVariants: Variants = {
  neutral: { transition: _springTransition },
  excited: { transition: _springTransition },
  thinking: { transition: _springTransition },
  concerned: { transition: _springTransition },
  proud: { transition: _springTransition },
  confidential: { transition: _springTransition },
};

export const idleAnimation = {
  y: [0, -2, 0],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const scanAnimation = {
  rotate: [0, 8, -8, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const radarPingAnimation = {
  scale: [1, 1.3, 1],
  opacity: [1, 0.6, 1],
  transition: {
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const typewriterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const letterVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.05 },
  },
};
