import { DIFFICULTIES } from "../game/config.js";

export default function DifficultyTabs({ difficulty, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/25 p-1">
      {Object.entries(DIFFICULTIES).map(([key, value]) => {
        const active = difficulty === key;

        return (
          <button
            className={`rounded-md px-3 py-3 text-left transition ${
              active
                ? "bg-cyan text-asphalt shadow-neon"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
            key={key}
            onClick={() => onChange(key)}
            type="button"
          >
            <span className="block text-sm font-bold">{value.label}</span>
            <span
              className={`mt-1 block text-xs ${
                active ? "text-asphalt/70" : "text-white/50"
              }`}
            >
              {value.tone}
            </span>
          </button>
        );
      })}
    </div>
  );
}
