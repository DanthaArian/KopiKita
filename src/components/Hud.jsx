import { motion } from "framer-motion";
import { Pause, Shield, Volume2, VolumeX, Zap } from "lucide-react";

function Stat({ label, value, accent = "text-white" }) {
  return (
    <div className="min-w-[82px] rounded-md border border-white/10 bg-black/30 px-2 py-1.5 sm:min-w-[78px] sm:px-3 sm:py-2">
      <p className="text-[10px] text-white/50 sm:text-xs">{label}</p>
      <p className={`text-base font-black tabular-nums sm:text-lg ${accent}`}>
        {value}
      </p>
    </div>
  );
}

export default function Hud({ muted, onPause, onToggleMute, stats, visible }) {
  if (!visible) return null;

  const energyPercent = Math.max(0, Math.min(100, stats.energy));
  const VolumeIcon = muted ? VolumeX : Volume2;

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4"
      initial={{ y: -16, opacity: 0 }}
    >
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-3">
        <div className="glass-panel pointer-events-auto flex max-w-[calc(100vw-96px)] flex-wrap items-center gap-1.5 p-1.5 sm:gap-2 sm:p-2">
          <Stat
            accent="text-cyan"
            label="Score"
            value={Math.floor(stats.score).toLocaleString("id-ID")}
          />
          <Stat
            accent="text-amber"
            label="Best"
            value={Math.floor(stats.highScore).toLocaleString("id-ID")}
          />
          <Stat
            accent="text-magenta"
            label="Speed"
            value={`${Math.round(stats.speed)} km/h`}
          />
          <div className="min-w-[176px] rounded-md border border-white/10 bg-black/30 px-2 py-1.5 sm:min-w-[158px] sm:px-3 sm:py-2">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-1 text-[10px] text-white/60 sm:text-xs">
                <Zap className="h-3.5 w-3.5 text-acid" aria-hidden="true" />
                Energy
              </p>
              <p className="text-[10px] font-bold text-white/70 sm:text-xs">
                {Math.round(energyPercent)}%
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-md bg-white/10">
              <div
                className="h-full rounded-md bg-gradient-to-r from-acid via-cyan to-magenta shadow-neon transition-[width]"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>
          <div
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-2 sm:min-h-[52px] sm:min-w-[58px] sm:px-3 ${
              stats.shield
                ? "border-cyan/60 bg-cyan/10 text-cyan shadow-neon"
                : "border-white/10 bg-black/30 text-white/30"
            }`}
            title="Shield"
          >
            <Shield className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <button
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            className="glass-panel flex h-11 w-11 items-center justify-center text-white transition hover:border-cyan/70 hover:text-cyan"
            onClick={onToggleMute}
            type="button"
          >
            <VolumeIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            aria-label="Pause"
            className="glass-panel flex h-11 w-11 items-center justify-center text-white transition hover:border-cyan/70 hover:text-cyan"
            onClick={onPause}
            type="button"
          >
            <Pause className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
