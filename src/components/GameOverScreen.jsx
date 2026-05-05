import { motion } from "framer-motion";
import { Home, RotateCcw, Trophy } from "lucide-react";
import GameButton from "./GameButton.jsx";

function ResultStat({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/25 p-3 text-left">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-black tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}

export default function GameOverScreen({ finalStats, onBackToMenu, onPlayAgain }) {
  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 grid place-items-center px-4 py-5"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <div className="screen-vignette absolute inset-0" />
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel relative w-full max-w-2xl p-5 sm:p-7"
        exit={{ y: 18, opacity: 0 }}
        initial={{ y: 26, opacity: 0 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Game Over
            </div>
            <h2 className="neon-title text-4xl font-black sm:text-5xl">
              Final Score
            </h2>
            <p className="mt-2 text-5xl font-black text-cyan sm:text-6xl">
              {Math.floor(finalStats.score).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-left">
            <p className="text-sm text-amber/80">High Score</p>
            <p className="text-3xl font-black text-amber">
              {Math.floor(finalStats.highScore).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <ResultStat
            label="Coins"
            value={Math.floor(finalStats.coins).toLocaleString("id-ID")}
          />
          <ResultStat
            label="Distance"
            value={`${Math.floor(finalStats.distance).toLocaleString(
              "id-ID",
            )} m`}
          />
          <ResultStat
            label="Top Speed"
            value={`${Math.round(finalStats.speed).toLocaleString("id-ID")} km/h`}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <GameButton icon={RotateCcw} onClick={onPlayAgain} variant="primary">
            Play Again
          </GameButton>
          <GameButton icon={Home} onClick={onBackToMenu}>
            Back to Menu
          </GameButton>
        </div>
      </motion.div>
    </motion.section>
  );
}
