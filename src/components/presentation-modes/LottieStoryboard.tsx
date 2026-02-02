import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";

const makeLottieLayer = (shapes: object[], op = 60) => ({
  v: "4.8.0",
  fr: 30,
  ip: 0,
  op,
  w: 100,
  h: 100,
  nm: "anim",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Layer",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [50, 50, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes,
      ip: 0,
      op,
      st: 0,
      bm: 0,
    },
  ],
});

const SPINNER_JSON = makeLottieLayer(
  [
    {
      ty: "gr",
      it: [
        {
          ty: "el",
          s: { a: 0, k: [60, 60], ix: 2 },
          p: { a: 0, k: [0, 0], ix: 3 },
          nm: "Ellipse",
          hd: false,
        },
        {
          ty: "st",
          c: { a: 0, k: [0.4, 0.4, 0.9, 1], ix: 3 },
          o: { a: 0, k: 100, ix: 4 },
          w: { a: 0, k: 6, ix: 5 },
          lc: 2,
          lj: 2,
          ml: 4,
          nm: "Stroke",
          hd: false,
          d: [
            { n: "d", nm: "dash", v: { a: 0, k: 80, ix: 1 } },
            { n: "g", nm: "gap", v: { a: 0, k: 100, ix: 2 } },
            {
              n: "o",
              nm: "offset",
              v: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    t: 0,
                    s: [0],
                  },
                  { t: 60, s: [360] },
                ],
                ix: 7,
              },
            },
          ],
        },
      ],
      nm: "Spinner",
      np: 2,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: "ADBE Vector Group",
      hd: false,
    },
  ],
  60,
);

const HEART_JSON = makeLottieLayer(
  [
    {
      ty: "gr",
      it: [
        {
          ty: "sh",
          nm: "Heart",
          hd: false,
          ks: {
            a: 0,
            k: {
              i: [
                [0, 0],
                [-8, -12],
                [-20, 0],
                [0, 12],
                [0, 0],
                [0, 12],
                [20, 0],
                [8, -12],
              ],
              o: [
                [0, 0],
                [-12, 8],
                [0, -20],
                [12, 8],
                [0, 0],
                [-12, 8],
                [0, -20],
                [12, 8],
              ],
              v: [
                [0, 15],
                [-8, 5],
                [-20, -8],
                [-8, -15],
                [0, -5],
                [8, -15],
                [20, -8],
                [8, 5],
              ],
              c: true,
            },
            ix: 2,
          },
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.9, 0.2, 0.3, 1], ix: 4 },
          o: { a: 0, k: 100, ix: 5 },
          r: 1,
          nm: "Fill",
          hd: false,
        },
        {
          ty: "tm",
          s: { a: 0, k: 0, ix: 1 },
          e: { a: 0, k: 100, ix: 2 },
          o: { a: 0, k: 0, ix: 3 },
          m: 1,
          ix: 3,
          nm: "Trim",
          hd: false,
        },
      ],
      nm: "Heart Group",
      np: 3,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: "ADBE Vector Group",
      hd: false,
    },
  ],
  60,
);

const ROCKET_JSON = makeLottieLayer(
  [
    {
      ty: "gr",
      it: [
        {
          ty: "sh",
          nm: "Rocket",
          hd: false,
          ks: {
            a: 0,
            k: {
              i: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
              ],
              o: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
              ],
              v: [
                [0, -25],
                [10, 10],
                [0, 5],
                [-10, 10],
              ],
              c: true,
            },
            ix: 2,
          },
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.95, 0.5, 0.1, 1], ix: 4 },
          o: { a: 0, k: 100, ix: 5 },
          r: 1,
          nm: "Fill",
          hd: false,
        },
      ],
      nm: "Rocket Group",
      np: 2,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: "ADBE Vector Group",
      hd: false,
    },
  ],
  60,
);

const STAR_JSON = makeLottieLayer(
  [
    {
      ty: "gr",
      it: [
        {
          ty: "sr",
          sy: 1,
          d: 1,
          pt: { a: 0, k: 5, ix: 3 },
          p: { a: 0, k: [0, 0], ix: 4 },
          r: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [0],
              },
              { t: 60, s: [360] },
            ],
            ix: 5,
          },
          ir: { a: 0, k: 10, ix: 6 },
          is: { a: 0, k: 0, ix: 8 },
          or: { a: 0, k: 25, ix: 7 },
          os: { a: 0, k: 0, ix: 9 },
          ix: 1,
          nm: "Star",
          hd: false,
        },
        {
          ty: "fl",
          c: { a: 0, k: [1, 0.8, 0, 1], ix: 4 },
          o: { a: 0, k: 100, ix: 5 },
          r: 1,
          nm: "Fill",
          hd: false,
        },
        {
          ty: "st",
          c: { a: 0, k: [1, 0.6, 0, 1], ix: 3 },
          o: { a: 0, k: 100, ix: 4 },
          w: { a: 0, k: 2, ix: 5 },
          lc: 2,
          lj: 2,
          ml: 4,
          nm: "Stroke",
          hd: false,
        },
      ],
      nm: "Star Group",
      np: 3,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: "ADBE Vector Group",
      hd: false,
    },
  ],
  60,
);

const CHECKMARK_JSON = makeLottieLayer(
  [
    {
      ty: "gr",
      it: [
        {
          ty: "sh",
          nm: "Path 1",
          hd: false,
          ks: {
            a: 1,
            k: [
              {
                i: { x: 0.833, y: 0.833 },
                o: { x: 0.167, y: 0.167 },
                t: 0,
                s: [
                  {
                    i: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [-20, 0],
                      [-20, 0],
                      [-20, 0],
                    ],
                    c: false,
                  },
                ],
              },
              {
                t: 30,
                s: [
                  {
                    i: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [-20, 0],
                      [-5, 15],
                      [-5, 15],
                    ],
                    c: false,
                  },
                ],
              },
              {
                t: 60,
                s: [
                  {
                    i: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    o: [
                      [0, 0],
                      [0, 0],
                      [0, 0],
                    ],
                    v: [
                      [-20, 0],
                      [-5, 15],
                      [20, -15],
                    ],
                    c: false,
                  },
                ],
              },
            ],
            ix: 2,
          },
        },
        {
          ty: "st",
          c: { a: 0, k: [0.12, 0.44, 1, 1], ix: 3 },
          o: { a: 0, k: 100, ix: 4 },
          w: { a: 0, k: 8, ix: 5 },
          lc: 2,
          lj: 2,
          ml: 4,
          nm: "Stroke 1",
          hd: false,
        },
      ],
      nm: "Group 1",
      np: 2,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: "ADBE Vector Group",
      hd: false,
    },
  ],
  60,
);

const ANIMATIONS = [
  SPINNER_JSON,
  SPINNER_JSON,
  HEART_JSON,
  HEART_JSON,
  ROCKET_JSON,
  ROCKET_JSON,
  STAR_JSON,
  STAR_JSON,
];

const STORY_STEPS = [
  {
    id: "alex",
    title: "Meet Alex.",
    description:
      "Alex has a problem. A cluttered inbox and a deadline that won't wait. They need a solution that feels like a breath of fresh air.",
    bg: "bg-slate-50",
  },
  {
    id: "overwhelm",
    title: "The Overwhelm.",
    description:
      "Twelve tabs open. Three half-finished decks. A boss who wants 'something that pops.' The spinner of doom mocks from the screen.",
    bg: "bg-red-50",
  },
  {
    id: "discovery",
    title: "A Glimmer of Hope.",
    description:
      "Alex discovers Mister Presentations. No more boring slides. No more friction. Just pure, unadulterated creativity.",
    bg: "bg-indigo-50",
  },
  {
    id: "spark",
    title: "The Spark.",
    description:
      "Something clicks. The first slide lands. The second one sings. Alex feels the heartbeat of a story coming alive.",
    bg: "bg-pink-50",
  },
  {
    id: "creation",
    title: "Seamless Creation.",
    description:
      "With a few gestures, the narrative takes shape. The components snap into place. The animation breathes life into the data.",
    bg: "bg-teal-50",
  },
  {
    id: "launch",
    title: "Liftoff.",
    description:
      "The deck is shared. The link is live. Alex hits present and the room goes quiet — the good kind of quiet.",
    bg: "bg-amber-50",
  },
  {
    id: "success",
    title: "The Standing Ovation.",
    description:
      "The presentation is a triumph. The audience is captivated. Alex is the hero of the hour.",
    bg: "bg-orange-50",
  },
  {
    id: "encore",
    title: "The Encore.",
    description:
      "They want another one. And this time, Alex knows exactly where to start.",
    bg: "bg-yellow-50",
  },
];

export function LottieStoryboard() {
  const [step, setStep] = useState(0);

  const next = useCallback(
    () => setStep((s) => Math.min(s + 1, STORY_STEPS.length - 1)),
    [],
  );
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => setStep(0), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const currentStep = STORY_STEPS[step];

  return (
    <div
      className={`relative w-full h-screen transition-colors duration-700 ${currentStep.bg} flex flex-col overflow-hidden font-display`}
    >
      <div className="absolute top-12 left-0 right-0 text-center px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentStep.id + "title"}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="text-5xl md:text-7xl font-bold text-indigo-950 tracking-tight"
          >
            {currentStep.title}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id + "lottie"}
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.1, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-xl aspect-square flex items-center justify-center"
          >
            <Lottie
              animationData={ANIMATIONS[step] || CHECKMARK_JSON}
              loop={true}
              className="w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-24 left-0 right-0 text-center px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep.id + "desc"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            {currentStep.description}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg z-20">
        <button
          onClick={prev}
          disabled={step === 0}
          className={`p-2 rounded-full transition-colors ${step === 0 ? "text-slate-300" : "text-indigo-600 hover:bg-indigo-50"}`}
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex gap-2">
          {STORY_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-all duration-500 ${
                i === step ? "bg-indigo-600 w-12" : "bg-indigo-200"
              }`}
            />
          ))}
        </div>

        {step === STORY_STEPS.length - 1 ? (
          <button
            onClick={reset}
            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <RefreshCcw size={32} />
          </button>
        ) : (
          <button
            onClick={next}
            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
