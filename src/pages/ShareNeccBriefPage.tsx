import { FormEvent, SyntheticEvent, useEffect, useState } from "react";

const SESSION_UNLOCK_KEY = "share:necc-circular-construction-brief:unlocked";
const SHARED_DECK_SRC = "/shares/necc-open-collaborator-brief-deck.html";

function readSessionUnlock() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(SESSION_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSessionUnlock(unlocked: boolean) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    if (unlocked) {
      window.sessionStorage.setItem(SESSION_UNLOCK_KEY, "1");
    } else {
      window.sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

export function ShareNeccBriefPage() {
  const expectedPasscode = (import.meta.env.VITE_SHARE_PASSCODE ?? "").trim();
  const hasConfiguredPasscode = expectedPasscode.length > 0;

  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [deckLoadError, setDeckLoadError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "NECC Shared Brief";
  }, []);

  useEffect(() => {
    if (!hasConfiguredPasscode) {
      setIsUnlocked(false);
      return;
    }

    setIsUnlocked(readSessionUnlock());
  }, [hasConfiguredPasscode]);

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasConfiguredPasscode) {
      setUnlockError(
        "Share access is not configured. Set VITE_SHARE_PASSCODE and redeploy.",
      );
      return;
    }

    if (enteredPasscode === expectedPasscode) {
      writeSessionUnlock(true);
      setIsUnlocked(true);
      setUnlockError(null);
      return;
    }

    setUnlockError("Incorrect passcode. Please try again.");
  };

  if (isUnlocked) {
    const handleIframeLoad = (
      event: SyntheticEvent<HTMLIFrameElement, Event>,
    ) => {
      let loadedTitle = "";
      try {
        loadedTitle = event.currentTarget.contentDocument?.title?.trim() ?? "";
      } catch {
        setDeckLoadError(
          "Browser frame access is restricted in this session. Use the direct deck link below.",
        );
        return;
      }

      // If the app shell loads inside the iframe, the static share file is missing from deployment.
      if (loadedTitle === "Mister Presentations") {
        setDeckLoadError(
          "Share deck file is missing from this deployment. Please redeploy with public/shares/necc-open-collaborator-brief-deck.html included.",
        );
      } else {
        setDeckLoadError(null);
      }
    };

    return (
      <main className="h-screen w-screen bg-black relative">
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
          <a
            href={SHARED_DECK_SRC}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center border-2 border-border bg-card/90 text-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
          >
            Open Deck Directly
          </a>
          <button
            type="button"
            onClick={() => {
              writeSessionUnlock(false);
              setIsUnlocked(false);
              setDeckLoadError(null);
            }}
            className="inline-flex items-center border-2 border-border bg-card/90 text-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
          >
            Lock
          </button>
        </div>
        {deckLoadError ? (
          <section className="absolute inset-0 z-10 flex items-center justify-center p-6 pointer-events-none">
            <div className="max-w-xl w-full border-2 border-border bg-card text-fg shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] p-5 space-y-3 pointer-events-auto">
              <h2 className="font-display text-2xl uppercase leading-none">
                Share Deck Not Available
              </h2>
              <p className="text-sm text-fg/75">{deckLoadError}</p>
              <a
                href={SHARED_DECK_SRC}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-mono text-xs uppercase tracking-wider text-accent hover:underline"
              >
                Open expected deck URL directly
              </a>
            </div>
          </section>
        ) : null}
        <iframe
          title="NECC Shared Presentation"
          src={SHARED_DECK_SRC}
          className="h-full w-full border-0"
          allow="fullscreen"
          onLoad={handleIframeLoad}
          onError={() =>
            setDeckLoadError(
              "Unable to load the shared deck file from this deployment.",
            )
          }
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-fg font-body flex items-center justify-center p-6 selection:bg-accent selection:text-fg">
      <section className="w-full max-w-md border-2 border-border bg-card shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] p-6 space-y-5">
        <header className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-fg/60">
            Special Access
          </p>
          <h1 className="font-display text-3xl uppercase leading-none">
            NECC Shared Brief
          </h1>
          <p className="text-sm text-fg/70">
            Enter passcode to view this isolated share presentation.
          </p>
          {!hasConfiguredPasscode ? (
            <p className="text-sm text-amber-300 font-medium">
              This environment is not configured yet. Set VITE_SHARE_PASSCODE
              and redeploy.
            </p>
          ) : null}
        </header>

        <form onSubmit={handleUnlock} className="space-y-4">
          <label className="block space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-fg/70">
              Passcode
            </span>
            <input
              type="password"
              value={enteredPasscode}
              onChange={(event) => setEnteredPasscode(event.target.value)}
              autoComplete="current-password"
              className="w-full border-2 border-border bg-bg px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
              placeholder="Enter passcode"
            />
          </label>

          {unlockError ? (
            <p className="text-sm text-red-300 font-medium">{unlockError}</p>
          ) : null}

          <button
            type="submit"
            className="w-full border-2 border-border bg-accent text-fg font-mono font-bold uppercase tracking-wide px-4 py-2 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            Unlock Presentation
          </button>
        </form>
      </section>
    </main>
  );
}
