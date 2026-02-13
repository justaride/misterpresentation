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
  const [showPasscode, setShowPasscode] = useState(false);
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

    if (enteredPasscode.trim() === expectedPasscode) {
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
      <main className="relative h-screen w-screen overflow-hidden bg-[#040810] text-[#f4f8ff]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_12%_18%,rgba(0,229,255,0.16),transparent_60%),radial-gradient(900px_600px_at_88%_22%,rgba(245,101,101,0.12),transparent_62%),linear-gradient(180deg,#040810_0%,#050a14_100%)]"
        />
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200 backdrop-blur">
            NECC Shared Brief
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={SHARED_DECK_SRC}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/16"
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
              className="inline-flex items-center rounded-full border border-white/25 bg-white/8 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/14"
            >
              Lock
            </button>
          </div>
        </div>
        {deckLoadError ? (
          <section className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
            <div className="pointer-events-auto w-full max-w-xl space-y-3 rounded-3xl border border-rose-200/45 bg-slate-950/88 p-6 text-slate-100 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur">
              <h2 className="font-display text-2xl uppercase leading-none text-rose-200">
                Share Deck Not Available
              </h2>
              <p className="text-sm text-slate-200/85">{deckLoadError}</p>
              <a
                href={SHARED_DECK_SRC}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-cyan-200 hover:underline"
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
    <main className="relative min-h-screen overflow-hidden bg-bg text-fg font-body selection:bg-accent selection:text-fg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_450px_at_14%_14%,rgba(182,255,77,0.24),transparent_64%),radial-gradient(780px_420px_at_88%_12%,rgba(255,176,0,0.18),transparent_64%),linear-gradient(180deg,rgba(255,251,242,0.62)_0%,rgba(255,251,242,0.08)_65%,rgba(255,251,242,0)_100%)]"
      />
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-10">
        <section className="space-y-6 rounded-[2rem] border-2 border-border/80 bg-card/80 p-6 shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] backdrop-blur md:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/60">
            Invite-only Share
          </p>
          <h1 className="font-display text-4xl uppercase leading-[0.9] md:text-6xl">
            NECC Circular Construction Brief
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-fg/75 md:text-lg">
            This shared deck is structured as an 8-page decision narrative:
            market challenge, platform design, delivery model, and collaboration
            fit.
          </p>
          <div className="grid gap-3 text-sm text-fg/75 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/45 bg-bg/65 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg/60">
                Reading time
              </p>
              <p className="mt-1 font-semibold text-fg">Approx. 7-8 minutes</p>
            </div>
            <div className="rounded-2xl border border-border/45 bg-bg/65 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg/60">
                Slide count
              </p>
              <p className="mt-1 font-semibold text-fg">
                8 focused pages
              </p>
            </div>
          </div>
        </section>

        <section className="w-full rounded-[2rem] border-2 border-border bg-card p-6 shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] md:p-7">
          <header className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/60">
              Special Access
            </p>
            <h2 className="font-display text-3xl uppercase leading-none">
              Enter Passcode
            </h2>
            <p className="text-sm text-fg/70">
              Use the provided passcode to open the isolated presentation view.
            </p>
            {!hasConfiguredPasscode ? (
              <p className="rounded-xl border border-amber-900/30 bg-amber-200/35 px-3 py-2 text-sm font-medium text-amber-900">
                This environment is not configured yet. Set VITE_SHARE_PASSCODE
                and redeploy.
              </p>
            ) : null}
          </header>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <label htmlFor="share-passcode" className="block space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-fg/70">
                Passcode
              </span>
              <div className="relative">
                <input
                  id="share-passcode"
                  type={showPasscode ? "text" : "password"}
                  value={enteredPasscode}
                  onChange={(event) => setEnteredPasscode(event.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border-2 border-border/80 bg-bg/60 px-3 py-2.5 pr-28 font-mono text-sm focus:border-accent focus:outline-none"
                  placeholder="Enter passcode"
                  aria-invalid={unlockError ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-border/65 bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg/75 transition-colors hover:bg-bg"
                >
                  {showPasscode ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg/55">
              Tip: passcode is checked exactly; extra spaces are ignored.
            </p>

            {unlockError ? (
              <p
                role="alert"
                className="rounded-xl border border-red-900/35 bg-red-200/30 px-3 py-2 text-sm font-medium text-red-900"
              >
                {unlockError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!hasConfiguredPasscode || enteredPasscode.trim().length === 0}
              className="w-full rounded-xl border-2 border-border bg-accent px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-fg shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:translate-y-0"
            >
              Unlock Presentation
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
