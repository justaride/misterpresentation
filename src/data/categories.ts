import {
  MousePointerClick,
  Presentation,
  BarChart3,
  Box,
  Type,
  Sparkles,
  Code,
  BookOpen,
} from "lucide-react";
import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  { id: "scroll-driven", label: "Scroll-Driven", icon: MousePointerClick },
  { id: "slide-based", label: "Slide-Based", icon: Presentation },
  { id: "interactive-data", label: "Interactive Data", icon: BarChart3 },
  { id: "3d-webgl", label: "3D / WebGL", icon: Box },
  { id: "typography", label: "Typography", icon: Type },
  { id: "animation-heavy", label: "Animation", icon: Sparkles },
  { id: "code-focused", label: "Code-Focused", icon: Code },
  { id: "storytelling", label: "Storytelling", icon: BookOpen },
];
