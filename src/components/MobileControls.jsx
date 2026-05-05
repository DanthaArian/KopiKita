import { ArrowLeft, ArrowRight, Pause, Zap } from "lucide-react";

function HoldButton({ children, disabled, label, onDown, onUp }) {
  const release = (event) => {
    event.preventDefault();
    onUp();
  };

  return (
    <button
      aria-label={label}
      className={`glass-panel flex h-16 w-16 select-none items-center justify-center text-white transition active:scale-95 ${
        disabled ? "opacity-50" : "active:border-cyan/80 active:text-cyan"
      }`}
      disabled={disabled}
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={release}
      onPointerDown={(event) => {
        event.preventDefault();
        onDown();
      }}
      onPointerLeave={release}
      onPointerUp={release}
      type="button"
    >
      {children}
    </button>
  );
}

export default function MobileControls({ energy, onPause, setControl, visible }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-auto flex gap-3">
        <HoldButton
          label="Move left"
          onDown={() => setControl("left", true)}
          onUp={() => setControl("left", false)}
        >
          <ArrowLeft className="h-7 w-7" aria-hidden="true" />
        </HoldButton>
        <HoldButton
          label="Move right"
          onDown={() => setControl("right", true)}
          onUp={() => setControl("right", false)}
        >
          <ArrowRight className="h-7 w-7" aria-hidden="true" />
        </HoldButton>
      </div>

      <div className="pointer-events-auto flex gap-3">
        <HoldButton
          disabled={energy <= 1}
          label="Boost"
          onDown={() => setControl("boost", true)}
          onUp={() => setControl("boost", false)}
        >
          <Zap className="h-7 w-7 text-acid" aria-hidden="true" />
        </HoldButton>
        <button
          aria-label="Pause"
          className="glass-panel flex h-16 w-16 items-center justify-center text-white transition active:scale-95 active:border-cyan/80 active:text-cyan"
          onClick={onPause}
          type="button"
        >
          <Pause className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
