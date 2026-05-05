import { motion } from "framer-motion";
import { Home, Play, RotateCcw } from "lucide-react";
import GameButton from "./GameButton.jsx";

export default function PauseMenu({ onBackToMenu, onRestart, onResume }) {
  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 grid place-items-center px-4"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <div className="screen-vignette absolute inset-0" />
      <motion.div
        animate={{ y: 0, scale: 1 }}
        className="glass-panel relative w-full max-w-md p-6 text-center"
        exit={{ y: 18, scale: 0.98 }}
        initial={{ y: 24, scale: 0.96 }}
      >
        <p className="text-sm font-semibold text-cyan">Run paused</p>
        <h2 className="mt-2 text-4xl font-black">Neon Drift Runner</h2>
        <div className="mt-6 grid gap-3">
          <GameButton icon={Play} onClick={onResume} variant="primary">
            Resume
          </GameButton>
          <GameButton icon={RotateCcw} onClick={onRestart}>
            Restart
          </GameButton>
          <GameButton icon={Home} onClick={onBackToMenu}>
            Back to Menu
          </GameButton>
        </div>
      </motion.div>
    </motion.section>
  );
}
