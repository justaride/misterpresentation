import type { LucideIcon } from "lucide-react";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ExampleStatus = "available" | "coming-soon";

export type PresentationFormat = 
  | "standard"
  | "pecha-kucha" 
  | "ignite" 
  | "takahashi" 
  | "lessig" 
  | "10-20-30" 
  | "bento" 
  | "scrollytelling";

export type Example = {
  id: string;
  title: string;
  description: string;
  category: string;
  format?: PresentationFormat;
  difficulty: Difficulty;
  tags: string[];
  status: ExampleStatus;
};

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
};
