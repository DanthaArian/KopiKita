import { motion } from "framer-motion";
import { Gamepad2, Play, Volume2, VolumeX } from "lucide-react";
import DifficultyTabs from "./DifficultyTabs.jsx";
import GameButton from "./GameButton.jsx";

export default function StartScreen({
  difficulty,
  highScore,
  muted,
  onDifficultyChange,
  onHowToPlay,
  onPlay,
  onToggleMute,
}) {
  const VolumeIcon = muted ? VolumeX : Volume2;

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex items-center justify-center px-4 py-5"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <div className="screen-vignette absolute inset-0" />
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="relative grid w-full max-w-6xl gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center"
        exit={{ y: 18, opacity: 0 }}
        initial={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <div className="glass-panel p-5 sm:p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            Cyber arcade racer
          </div>

          <h1 className="neon-title max-w-3xl font-display text-5xl font-black leading-none text-white sm:text-7xl lg:text-8xl">
            Neon Drift Runner
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Pacu mobil neon, ambil energi, aktifkan shield, dan cari celah di
            runway kota cyberpunk yang makin cepat setiap detik.
          </p>

          <div className="mt-6 max-w-xl">
            <p className="mb-3 text-sm font-semibold text-white/70">
              Difficulty
            </p>
            <DifficultyTabs
              difficulty={difficulty}
              onChange={onDifficultyChange}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <GameButton icon={Play} onClick={onPlay} variant="primary">
              Play
            </GameButton>
            <GameButton onClick={onHowToPlay}>How to Play</GameButton>
            <GameButton
              aria-label={muted ? "Unmute sound" : "Mute sound"}
              icon={VolumeIcon}
              onClick={onToggleMute}
            >
              {muted ? "Unmute" : "Mute"}
            </GameButton>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          className="glass-panel hidden min-h-[430px] overflow-hidden p-5 lg:block"
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">High Score</p>
              <p className="mt-1 text-4xl font-black text-amber">
                {Math.floor(highScore).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-md border border-magenta/40 bg-magenta/10 px-3 py-2 text-sm font-bold text-magenta">
              LIVE RUN
            </div>
          </div>

          <div className="relative mt-8 h-72 overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <div className="absolute inset-x-1/2 top-0 h-full w-28 -translate-x-1/2 bg-cyan/10 blur-xl" />
            <div className="absolute left-1/2 top-4 h-[520px] w-[520px] -translate-x-1/2 rotate-45 border border-cyan/25" />
            <div className="absolute bottom-0 left-1/2 h-64 w-48 -translate-x-1/2 bg-gradient-to-t from-cyan/20 to-transparent [clip-path:polygon(18%_100%,82%_100%,58%_0,42%_0)]" />
            <div className="absolute bottom-10 left-1/2 h-24 w-14 -translate-x-1/2 rounded-md bg-gradient-to-b from-cyan to-magenta shadow-neon">
              <div className="mx-auto mt-3 h-8 w-7 rounded-md bg-slate-950/70" />
              <div className="absolute -bottom-8 left-1/2 h-20 w-7 -translate-x-1/2 bg-gradient-to-b from-cyan/80 to-transparent blur-md" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-cyan shadow-neon" />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
