export type MrNewsExpression =
  | "neutral"
  | "excited"
  | "thinking"
  | "concerned"
  | "proud"
  | "confidential";

export type MrNewsPose =
  | "idle"
  | "point"
  | "scan"
  | "stamp"
  | "shrug"
  | "whisper";

export type MrNewsState =
  | "online"
  | "scanning"
  | "alert"
  | "serious"
  | "presenting"
  | "error"
  | "dormant";

export type MrNewsProps = {
  size?: number;
  expression?: MrNewsExpression;
  pose?: MrNewsPose;
  state?: MrNewsState;
  animated?: boolean;
  className?: string;
};

export type SpeechBubbleStatus = "live" | "info" | "warn" | "error";

export type SpeechBubbleAction = {
  label: string;
  onClick: () => void;
};

export type SpeechBubbleProps = {
  status: SpeechBubbleStatus;
  message: string;
  subtext?: string;
  actions?: SpeechBubbleAction[];
  position?: "left" | "right" | "top";
  className?: string;
};

export type MrNewsWithBubbleProps = MrNewsProps & {
  bubbleStatus?: SpeechBubbleStatus;
  bubbleMessage?: string;
  bubbleSubtext?: string;
  bubbleActions?: SpeechBubbleAction[];
  bubblePosition?: "left" | "right" | "top";
};

export const STATE_MAPPING: Record<
  MrNewsState,
  { expression: MrNewsExpression; pose: MrNewsPose }
> = {
  online: { expression: "neutral", pose: "idle" },
  scanning: { expression: "thinking", pose: "scan" },
  alert: { expression: "excited", pose: "point" },
  serious: { expression: "concerned", pose: "stamp" },
  presenting: { expression: "proud", pose: "idle" },
  error: { expression: "concerned", pose: "shrug" },
  dormant: { expression: "neutral", pose: "idle" },
};
