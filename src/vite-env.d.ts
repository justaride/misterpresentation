/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVE_SSE_URL?: string;
  readonly VITE_LIVE_WS_URL?: string;
  readonly VITE_SHARE_PASSCODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
