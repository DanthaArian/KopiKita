export const STORAGE_KEYS = {
  highScore: "neon-drift-runner-high-score-v1",
};

export const INITIAL_STATS = {
  score: 0,
  highScore: 0,
  speed: 0,
  energy: 62,
  maxEnergy: 100,
  shield: 0,
  coins: 0,
  distance: 0,
};

export const DIFFICULTIES = {
  easy: {
    label: "Easy",
    tone: "Cruise",
    baseSpeed: 420,
    speedRamp: 9,
    spawnInterval: 1.05,
    itemInterval: 1.12,
    doubleObstacleChance: 0.18,
    scoreMultiplier: 0.95,
  },
  normal: {
    label: "Normal",
    tone: "Arcade",
    baseSpeed: 520,
    speedRamp: 13,
    spawnInterval: 0.86,
    itemInterval: 1,
    doubleObstacleChance: 0.3,
    scoreMultiplier: 1,
  },
  hard: {
    label: "Hard",
    tone: "Overdrive",
    baseSpeed: 630,
    speedRamp: 17,
    spawnInterval: 0.7,
    itemInterval: 0.92,
    doubleObstacleChance: 0.43,
    scoreMultiplier: 1.14,
  },
};
