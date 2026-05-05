import { useCallback, useEffect, useRef } from "react";

function playTone(ctx, frequency, start, duration, options = {}) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = options.type || "sine";
  oscillator.frequency.setValueAtTime(frequency, start);

  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(20, options.endFrequency),
      start + duration,
    );
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(options.volume || 0.08, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function playNoise(ctx, start, duration) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    const fade = 1 - index / data.length;
    data[index] = (Math.random() * 2 - 1) * fade;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, start);
  filter.frequency.exponentialRampToValueAtTime(120, start + duration);
  gain.gain.setValueAtTime(0.12, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(start);
  source.stop(start + duration);
}

export function useGameAudio(muted) {
  const contextRef = useRef(null);

  const getContext = useCallback(() => {
    if (muted) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }

    if (contextRef.current.state === "suspended") {
      contextRef.current.resume();
    }

    return contextRef.current;
  }, [muted]);

  const play = useCallback(
    (sound) => {
      const ctx = getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (sound === "coin") {
        playTone(ctx, 880, now, 0.09, { type: "triangle", volume: 0.05 });
        playTone(ctx, 1320, now + 0.06, 0.11, {
          type: "triangle",
          volume: 0.045,
        });
      }

      if (sound === "energy") {
        playTone(ctx, 260, now, 0.12, {
          endFrequency: 740,
          type: "sawtooth",
          volume: 0.05,
        });
        playTone(ctx, 520, now + 0.08, 0.14, {
          endFrequency: 1040,
          type: "triangle",
          volume: 0.04,
        });
      }

      if (sound === "shield") {
        playTone(ctx, 420, now, 0.16, {
          endFrequency: 220,
          type: "sine",
          volume: 0.065,
        });
        playTone(ctx, 840, now, 0.16, {
          endFrequency: 440,
          type: "sine",
          volume: 0.045,
        });
      }

      if (sound === "boost") {
        playTone(ctx, 150, now, 0.2, {
          endFrequency: 420,
          type: "sawtooth",
          volume: 0.04,
        });
      }

      if (sound === "hit") {
        playNoise(ctx, now, 0.26);
        playTone(ctx, 130, now, 0.18, {
          endFrequency: 65,
          type: "square",
          volume: 0.05,
        });
      }

      if (sound === "crash") {
        playNoise(ctx, now, 0.42);
        playTone(ctx, 90, now, 0.32, {
          endFrequency: 42,
          type: "sawtooth",
          volume: 0.07,
        });
      }

      if (sound === "start" || sound === "resume") {
        playTone(ctx, 330, now, 0.09, { type: "triangle", volume: 0.045 });
        playTone(ctx, 660, now + 0.07, 0.11, {
          type: "triangle",
          volume: 0.045,
        });
      }

      if (sound === "pause") {
        playTone(ctx, 420, now, 0.08, {
          endFrequency: 180,
          type: "sine",
          volume: 0.045,
        });
      }
    },
    [getContext],
  );

  useEffect(() => {
    return () => {
      if (contextRef.current) {
        contextRef.current.close();
      }
    };
  }, []);

  return { play };
}
