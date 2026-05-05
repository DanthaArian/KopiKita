import { useEffect, useRef } from "react";
import { DIFFICULTIES, INITIAL_STATS } from "../game/config.js";

const LANES = [-1, 0, 1];
const OBSTACLE_TYPES = ["barrier", "drone", "rival"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pseudoRandom(seed) {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

function shuffle(values) {
  const next = [...values];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function getRoad(dim) {
  const bottomWidth = clamp(
    dim.width * (dim.width < 760 ? 0.92 : 0.68),
    310,
    760,
  );
  const horizon = dim.height * (dim.height < 640 ? 0.18 : 0.14);

  return {
    bottom: dim.height + 30,
    bottomWidth,
    center: dim.width / 2,
    horizon,
    topWidth: bottomWidth * 0.18,
  };
}

function roadProgress(y, dim) {
  const road = getRoad(dim);
  return clamp((y - road.horizon) / (road.bottom - road.horizon), 0, 1);
}

function roadWidthAt(y, dim) {
  const road = getRoad(dim);
  const progress = roadProgress(y, dim);
  return lerp(road.topWidth, road.bottomWidth, Math.pow(progress, 1.45));
}

function laneX(lane, y, dim) {
  return dim.width / 2 + lane * roadWidthAt(y, dim) * 0.28;
}

function getPlayerMetrics(dim) {
  const road = getRoad(dim);
  const width = clamp(road.bottomWidth * 0.095, 34, 64);
  const bottomReserve = dim.width < 768 ? 146 : 96;

  return {
    height: width * 1.82,
    width,
    y: dim.height - bottomReserve,
  };
}

function createGameState(dim, difficulty) {
  const metrics = getPlayerMetrics(dim);
  const profile = DIFFICULTIES[difficulty] || DIFFICULTIES.normal;

  return {
    boostCooldown: 0,
    boostParticleTimer: 0,
    cityOffset: 0,
    coins: 0,
    difficulty,
    distance: 0,
    ended: false,
    energy: INITIAL_STATS.energy,
    itemTimer: 0.75,
    items: [],
    lastStatEmit: 0,
    objectId: 1,
    obstacles: [],
    particles: [],
    player: {
      height: metrics.height,
      invulnerable: 0,
      tilt: 0,
      vx: 0,
      width: metrics.width,
      x: dim.width / 2,
      y: metrics.y,
    },
    profile,
    roadOffset: 0,
    score: 0,
    shake: 0,
    shield: 0,
    spawnTimer: 0.8,
    speed: profile.baseSpeed,
    time: 0,
    topSpeed: 0,
  };
}

function adaptStateToResize(state, dim) {
  const road = getRoad(dim);
  const metrics = getPlayerMetrics(dim);
  state.player.width = metrics.width;
  state.player.height = metrics.height;
  state.player.y = metrics.y;
  state.player.x = clamp(
    state.player.x || dim.width / 2,
    road.center - road.bottomWidth / 2 + metrics.width,
    road.center + road.bottomWidth / 2 - metrics.width,
  );
}

function formatStats(state, highScore, final = false) {
  const displaySpeed = final ? state.topSpeed : state.currentDisplaySpeed || 0;

  return {
    coins: state.coins,
    distance: Math.floor(state.distance),
    energy: clamp(state.energy, 0, 100),
    highScore,
    maxEnergy: 100,
    score: Math.floor(state.score),
    shield: state.shield,
    speed: displaySpeed,
  };
}

function objectScale(y, dim) {
  return 0.42 + roadProgress(y, dim) * 0.95;
}

function obstacleMetrics(type, dim) {
  const road = getRoad(dim);
  const laneWidth = road.bottomWidth / 3;

  if (type === "drone") {
    return { height: laneWidth * 0.42, width: laneWidth * 0.58 };
  }

  if (type === "rival") {
    return { height: laneWidth * 0.78, width: laneWidth * 0.48 };
  }

  return { height: laneWidth * 0.38, width: laneWidth * 0.72 };
}

function getObstacleRect(obstacle, dim) {
  const metrics = obstacleMetrics(obstacle.type, dim);
  const scale = objectScale(obstacle.y, dim);
  const width = metrics.width * scale;
  const height = metrics.height * scale;
  const centerX = laneX(obstacle.lane, obstacle.y, dim) + obstacle.offset * roadWidthAt(obstacle.y, dim);

  return {
    centerX,
    centerY: obstacle.y,
    height,
    scale,
    width,
    x: centerX - width / 2,
    y: obstacle.y - height / 2,
  };
}

function getItemCircle(item, dim) {
  const scale = objectScale(item.y, dim);
  const radius = item.radius * scale;
  const centerX = laneX(item.lane, item.y, dim) + item.offset * roadWidthAt(item.y, dim);

  return {
    centerX,
    centerY: item.y,
    radius,
    scale,
  };
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function circleIntersectsRect(circle, rect) {
  const nearestX = clamp(circle.centerX, rect.x, rect.x + rect.width);
  const nearestY = clamp(circle.centerY, rect.y, rect.y + rect.height);
  const dx = circle.centerX - nearestX;
  const dy = circle.centerY - nearestY;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function getPlayerRect(state) {
  const { player } = state;
  return {
    height: player.height * 0.82,
    width: player.width * 0.78,
    x: player.x - (player.width * 0.78) / 2,
    y: player.y - (player.height * 0.82) / 2,
  };
}

function spawnParticle(state, particle) {
  state.particles.push({
    alpha: particle.alpha ?? 1,
    color: particle.color,
    life: particle.life,
    maxLife: particle.life,
    size: particle.size,
    vx: particle.vx,
    vy: particle.vy,
    x: particle.x,
    y: particle.y,
  });
}

function spawnBurst(state, x, y, color, count = 16) {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(60, 260);
    spawnParticle(state, {
      color,
      life: randomBetween(0.3, 0.72),
      size: randomBetween(2, 5),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      x,
      y,
    });
  }
}

function spawnBoostTrail(state) {
  const { player } = state;
  const jitter = randomBetween(-player.width * 0.32, player.width * 0.32);

  spawnParticle(state, {
    color: Math.random() > 0.45 ? "#33f6ff" : "#ff3df2",
    life: randomBetween(0.22, 0.36),
    size: randomBetween(4, 8),
    vx: randomBetween(-30, 30),
    vy: randomBetween(130, 220),
    x: player.x + jitter,
    y: player.y + player.height * 0.42,
  });
}

function spawnObstacleWave(state, dim) {
  const lanes = shuffle(LANES);
  const count = Math.random() < state.profile.doubleObstacleChance ? 2 : 1;
  const road = getRoad(dim);

  for (let index = 0; index < count; index += 1) {
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    state.obstacles.push({
      id: state.objectId,
      lane: lanes[index],
      offset: randomBetween(-0.018, 0.018),
      pulse: Math.random() * Math.PI * 2,
      type,
      y: road.horizon - randomBetween(70, 138) - index * 34,
    });
    state.objectId += 1;
  }
}

function spawnItemWave(state, dim) {
  const lane = LANES[Math.floor(Math.random() * LANES.length)];
  const roll = Math.random();
  const road = getRoad(dim);
  const type = roll < 0.64 ? "coin" : roll < 0.86 ? "energy" : "shield";
  const count = type === "coin" ? Math.floor(randomBetween(3, 6)) : 1;

  for (let index = 0; index < count; index += 1) {
    state.items.push({
      id: state.objectId,
      lane,
      offset: randomBetween(-0.012, 0.012),
      radius: type === "coin" ? 15 : 19,
      type,
      y: road.horizon - 70 - index * 48,
    });
    state.objectId += 1;
  }
}

function updateParticles(state, dt) {
  for (const particle of state.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 1 - dt * 1.6;
    particle.vy *= 1 - dt * 0.65;
  }

  state.particles = state.particles
    .filter((particle) => particle.life > 0)
    .slice(-120);
}

function updateAmbient(state, dt) {
  state.time += dt * 0.75;
  state.roadOffset += 210 * dt;
  state.cityOffset += 18 * dt;
  state.shake = Math.max(0, state.shake - dt * 2.4);
  updateParticles(state, dt);
}

function updateGame(state, dt, dim, controls, callbacks, highScore) {
  const road = getRoad(dim);
  const boostActive = controls.boost && state.energy > 0;
  const speedMultiplier = boostActive ? 1.48 : 1;
  const pxSpeed = state.speed * speedMultiplier;
  const displaySpeed = pxSpeed * 0.43;

  state.time += dt;
  state.speed = state.profile.baseSpeed + state.time * state.profile.speedRamp;
  state.currentDisplaySpeed = displaySpeed;
  state.topSpeed = Math.max(state.topSpeed, displaySpeed);
  state.roadOffset += pxSpeed * dt;
  state.cityOffset += pxSpeed * dt * 0.05;
  state.distance += pxSpeed * dt * 0.045;
  state.score += dt * state.speed * 0.16 * state.profile.scoreMultiplier * (boostActive ? 1.16 : 1);
  state.shake = Math.max(0, state.shake - dt * 2.8);
  state.player.invulnerable = Math.max(0, state.player.invulnerable - dt);

  if (boostActive) {
    state.energy = Math.max(0, state.energy - dt * 34);
    state.boostParticleTimer -= dt;
    state.boostCooldown -= dt;

    if (state.boostParticleTimer <= 0) {
      spawnBoostTrail(state);
      spawnBoostTrail(state);
      state.boostParticleTimer = 0.035;
    }

    if (state.boostCooldown <= 0) {
      callbacks.onSound("boost");
      state.boostCooldown = 0.32;
    }
  } else {
    state.energy = Math.min(100, state.energy + dt * 4.2);
    state.boostCooldown = Math.max(0, state.boostCooldown - dt);
  }

  if (state.energy <= 0) {
    controls.boost = false;
  }

  const direction = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const horizontalSpeed = road.bottomWidth * (boostActive ? 1.75 : 1.48);
  const desiredVx = direction * horizontalSpeed;
  state.player.vx = lerp(state.player.vx, desiredVx, clamp(dt * 11, 0, 1));
  state.player.x += state.player.vx * dt;
  state.player.tilt = lerp(
    state.player.tilt,
    clamp(state.player.vx / horizontalSpeed, -1, 1) * 0.34,
    clamp(dt * 8, 0, 1),
  );
  state.player.x = clamp(
    state.player.x,
    road.center - road.bottomWidth / 2 + state.player.width,
    road.center + road.bottomWidth / 2 - state.player.width,
  );

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnObstacleWave(state, dim);
    const pressure = 1 + Math.min(0.58, state.time / 95);
    state.spawnTimer = (state.profile.spawnInterval * randomBetween(0.78, 1.26)) / pressure;
  }

  state.itemTimer -= dt;
  if (state.itemTimer <= 0) {
    spawnItemWave(state, dim);
    state.itemTimer = state.profile.itemInterval * randomBetween(0.72, 1.42);
  }

  for (const obstacle of state.obstacles) {
    obstacle.y += pxSpeed * dt;
    obstacle.pulse += dt * 3;
  }

  for (const item of state.items) {
    item.y += pxSpeed * dt * 0.95;
  }

  state.obstacles = state.obstacles.filter((obstacle) => obstacle.y < dim.height + 150);
  state.items = state.items.filter((item) => item.y < dim.height + 120);
  updateParticles(state, dt);

  const playerRect = getPlayerRect(state);
  const collected = new Set();

  for (const item of state.items) {
    const circle = getItemCircle(item, dim);

    if (circleIntersectsRect(circle, playerRect)) {
      collected.add(item.id);

      if (item.type === "coin") {
        state.coins += 1;
        state.score += 120;
        spawnBurst(state, circle.centerX, circle.centerY, "#ffd166", 10);
        callbacks.onSound("coin");
      }

      if (item.type === "energy") {
        state.energy = Math.min(100, state.energy + 38);
        spawnBurst(state, circle.centerX, circle.centerY, "#a9ff4f", 16);
        callbacks.onSound("energy");
      }

      if (item.type === "shield") {
        state.shield = 1;
        spawnBurst(state, circle.centerX, circle.centerY, "#33f6ff", 18);
        callbacks.onSound("shield");
      }
    }
  }

  if (collected.size > 0) {
    state.items = state.items.filter((item) => !collected.has(item.id));
  }

  const clearedObstacles = new Set();

  for (const obstacle of state.obstacles) {
    const obstacleRect = getObstacleRect(obstacle, dim);

    if (rectsOverlap(playerRect, obstacleRect) && state.player.invulnerable <= 0) {
      if (state.shield) {
        state.shield = 0;
        state.player.invulnerable = 1.05;
        state.shake = 0.28;
        clearedObstacles.add(obstacle.id);
        spawnBurst(state, obstacleRect.centerX, obstacleRect.centerY, "#33f6ff", 28);
        callbacks.onSound("hit");
      } else if (!state.ended) {
        state.ended = true;
        state.shake = 0.55;
        spawnBurst(state, state.player.x, state.player.y, "#ff4d6d", 44);
        callbacks.onSound("crash");
        callbacks.onGameOver(formatStats(state, Math.max(highScore, state.score), true));
      }
    }
  }

  if (clearedObstacles.size > 0) {
    state.obstacles = state.obstacles.filter(
      (obstacle) => !clearedObstacles.has(obstacle.id),
    );
  }

  state.lastStatEmit -= dt;
  if (state.lastStatEmit <= 0 && !state.ended) {
    callbacks.onStats(formatStats(state, highScore));
    state.lastStatEmit = 0.08;
  }
}

function drawSky(ctx, state, dim) {
  const gradient = ctx.createLinearGradient(0, 0, 0, dim.height);
  gradient.addColorStop(0, "#060713");
  gradient.addColorStop(0.45, "#08142a");
  gradient.addColorStop(1, "#0b0714");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, dim.width, dim.height);

  for (let index = 0; index < 82; index += 1) {
    const x = (pseudoRandom(index + 3) * dim.width + state.cityOffset * (0.02 + pseudoRandom(index) * 0.04)) % dim.width;
    const y = pseudoRandom(index + 11) * dim.height * 0.48;
    const twinkle = 0.34 + Math.sin(state.time * 2 + index) * 0.22;
    ctx.fillStyle = `rgba(255,255,255,${clamp(twinkle, 0.12, 0.56)})`;
    ctx.fillRect(x, y, 1.2, 1.2);
  }
}

function drawSkyline(ctx, state, dim, layer) {
  const road = getRoad(dim);
  const spacing = layer.spacing;
  const offset = -((state.cityOffset * layer.speed) % spacing) - spacing;
  const count = Math.ceil(dim.width / spacing) + 3;

  ctx.save();
  ctx.globalAlpha = layer.alpha;

  for (let index = 0; index < count; index += 1) {
    const seed = index + layer.seed;
    const width = spacing * lerp(0.58, 1.12, pseudoRandom(seed));
    const height = dim.height * lerp(layer.minHeight, layer.maxHeight, pseudoRandom(seed + 5));
    const x = offset + index * spacing;
    const y = road.horizon + layer.yOffset - height;

    const buildingGradient = ctx.createLinearGradient(0, y, 0, y + height);
    buildingGradient.addColorStop(0, layer.top);
    buildingGradient.addColorStop(1, layer.bottom);
    ctx.fillStyle = buildingGradient;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = layer.window;
    const windowGap = 14;
    for (let wy = y + 18; wy < y + height - 12; wy += windowGap) {
      for (let wx = x + 10; wx < x + width - 8; wx += 18) {
        if (pseudoRandom(wx * 0.4 + wy * 0.7 + seed) > 0.48) {
          ctx.globalAlpha = layer.alpha * lerp(0.25, 0.95, pseudoRandom(wx + wy));
          ctx.fillRect(wx, wy, 4, 8);
        }
      }
    }
  }

  ctx.restore();
}

function drawRoad(ctx, state, dim) {
  const road = getRoad(dim);
  const bottomLeft = road.center - road.bottomWidth / 2;
  const bottomRight = road.center + road.bottomWidth / 2;
  const topLeft = road.center - road.topWidth / 2;
  const topRight = road.center + road.topWidth / 2;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(topLeft, road.horizon);
  ctx.lineTo(topRight, road.horizon);
  ctx.lineTo(bottomRight, road.bottom);
  ctx.lineTo(bottomLeft, road.bottom);
  ctx.closePath();

  const roadGradient = ctx.createLinearGradient(0, road.horizon, 0, road.bottom);
  roadGradient.addColorStop(0, "#10182f");
  roadGradient.addColorStop(0.62, "#070b17");
  roadGradient.addColorStop(1, "#03040a");
  ctx.fillStyle = roadGradient;
  ctx.fill();

  ctx.clip();

  for (let index = 0; index < 34; index += 1) {
    const progress = (index * 0.045 + (state.roadOffset * 0.00035) % 0.045) % 1;
    const y = road.horizon + Math.pow(progress, 1.9) * (road.bottom - road.horizon);
    const width = roadWidthAt(y, dim);
    const alpha = clamp(progress * 0.75, 0.05, 0.42);

    ctx.strokeStyle = `rgba(51, 246, 255, ${alpha})`;
    ctx.lineWidth = lerp(0.5, 2.2, progress);
    ctx.beginPath();
    ctx.moveTo(road.center - width / 2, y);
    ctx.lineTo(road.center + width / 2, y);
    ctx.stroke();
  }

  for (const laneOffset of [-1 / 3, 1 / 3]) {
    for (let progress = (state.roadOffset * 0.00055) % 0.14; progress < 1; progress += 0.14) {
      const y1 = road.horizon + Math.pow(progress, 1.7) * (road.bottom - road.horizon);
      const y2 = road.horizon + Math.pow(Math.min(1, progress + 0.055), 1.7) * (road.bottom - road.horizon);
      const x1 = road.center + laneOffset * roadWidthAt(y1, dim);
      const x2 = road.center + laneOffset * roadWidthAt(y2, dim);
      const alpha = clamp(progress * 0.95, 0.12, 0.75);

      ctx.strokeStyle = `rgba(255, 61, 242, ${alpha})`;
      ctx.lineWidth = lerp(1.2, 4.5, progress);
      ctx.shadowColor = "#ff3df2";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  ctx.restore();

  for (const side of [-1, 1]) {
    ctx.save();
    ctx.strokeStyle = side < 0 ? "#33f6ff" : "#ff3df2";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(road.center + (road.topWidth / 2) * side, road.horizon);
    ctx.lineTo(road.center + (road.bottomWidth / 2) * side, road.bottom);
    ctx.stroke();
    ctx.restore();
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawObstacle(ctx, obstacle, dim, time) {
  const rect = getObstacleRect(obstacle, dim);
  const pulse = 0.65 + Math.sin(time * 5 + obstacle.pulse) * 0.18;

  ctx.save();
  ctx.translate(rect.centerX, rect.centerY);
  ctx.scale(rect.scale, rect.scale);

  if (obstacle.type === "barrier") {
    const base = obstacleMetrics("barrier", dim);
    const w = base.width;
    const h = base.height;

    ctx.shadowColor = "#ff4d6d";
    ctx.shadowBlur = 18 * pulse;
    roundedRect(ctx, -w / 2, -h / 2, w, h, 8);
    ctx.fillStyle = "#261123";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ff4d6d";
    ctx.stroke();

    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 4;
    for (let x = -w / 2 + 12; x < w / 2; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, h / 2 - 6);
      ctx.lineTo(x + 22, -h / 2 + 6);
      ctx.stroke();
    }
  }

  if (obstacle.type === "drone") {
    const base = obstacleMetrics("drone", dim);
    const w = base.width;
    const h = base.height;

    ctx.shadowColor = "#ff3df2";
    ctx.shadowBlur = 16 * pulse;
    ctx.strokeStyle = "#ff3df2";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.35, h * 0.36, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#16071c";
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#33f6ff";
    ctx.beginPath();
    ctx.moveTo(-w * 0.5, 0);
    ctx.lineTo(-w * 0.22, 0);
    ctx.moveTo(w * 0.22, 0);
    ctx.lineTo(w * 0.5, 0);
    ctx.stroke();

    ctx.fillStyle = "#33f6ff";
    ctx.fillRect(-w * 0.58, -3, 12, 6);
    ctx.fillRect(w * 0.58 - 12, -3, 12, 6);
  }

  if (obstacle.type === "rival") {
    const base = obstacleMetrics("rival", dim);
    const w = base.width;
    const h = base.height;

    ctx.shadowColor = "#ff4d6d";
    ctx.shadowBlur = 18 * pulse;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w * 0.45, -h * 0.16);
    ctx.lineTo(w * 0.38, h * 0.42);
    ctx.lineTo(0, h / 2);
    ctx.lineTo(-w * 0.38, h * 0.42);
    ctx.lineTo(-w * 0.45, -h * 0.16);
    ctx.closePath();
    ctx.fillStyle = "#2a0d18";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ff4d6d";
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 209, 102, 0.9)";
    ctx.fillRect(-w * 0.2, -h * 0.2, w * 0.4, h * 0.22);
    ctx.fillStyle = "#ff3df2";
    ctx.fillRect(-w * 0.35, h * 0.34, w * 0.18, 5);
    ctx.fillRect(w * 0.17, h * 0.34, w * 0.18, 5);
  }

  ctx.restore();
}

function drawItem(ctx, item, dim, time) {
  const circle = getItemCircle(item, dim);
  const spin = 0.35 + Math.abs(Math.sin(time * 5 + item.id)) * 0.65;

  ctx.save();
  ctx.translate(circle.centerX, circle.centerY);
  ctx.scale(circle.scale, circle.scale);

  if (item.type === "coin") {
    ctx.scale(spin, 1);
    ctx.shadowColor = "#ffd166";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd166";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff1a8";
    ctx.stroke();
    ctx.fillStyle = "rgba(5, 7, 17, 0.45)";
    ctx.fillRect(-3, -item.radius * 0.55, 6, item.radius * 1.1);
  }

  if (item.type === "energy") {
    ctx.shadowColor = "#a9ff4f";
    ctx.shadowBlur = 18;
    ctx.rotate(Math.sin(time * 3 + item.id) * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, -item.radius * 1.2);
    ctx.lineTo(item.radius, 0);
    ctx.lineTo(0, item.radius * 1.2);
    ctx.lineTo(-item.radius, 0);
    ctx.closePath();
    ctx.fillStyle = "#a9ff4f";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (item.type === "shield") {
    ctx.shadowColor = "#33f6ff";
    ctx.shadowBlur = 18;
    ctx.strokeStyle = "#33f6ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let index = 0; index < 6; index += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 6;
      const x = Math.cos(angle) * item.radius;
      const y = Math.sin(angle) * item.radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(51, 246, 255, 0.18)";
    ctx.fill();
  }

  ctx.restore();
}

function drawPlayer(ctx, state) {
  const { player } = state;
  const w = player.width;
  const h = player.height;
  const blink =
    player.invulnerable > 0 && Math.floor(state.time * 18) % 2 === 0 ? 0.55 : 1;

  ctx.save();
  ctx.globalAlpha = blink;
  ctx.translate(player.x, player.y);
  ctx.rotate(player.tilt);

  if (state.currentDisplaySpeed > state.speed * 0.5) {
    const flame = state.energy > 0 ? 1 : 0.4;
    const trail = ctx.createLinearGradient(0, h * 0.16, 0, h * 1.12);
    trail.addColorStop(0, `rgba(51, 246, 255, ${0.45 * flame})`);
    trail.addColorStop(0.45, "rgba(255, 61, 242, 0.24)");
    trail.addColorStop(1, "rgba(51, 246, 255, 0)");
    ctx.fillStyle = trail;
    ctx.beginPath();
    ctx.moveTo(-w * 0.34, h * 0.2);
    ctx.lineTo(w * 0.34, h * 0.2);
    ctx.lineTo(w * 0.14, h * 1.1);
    ctx.lineTo(-w * 0.14, h * 1.1);
    ctx.closePath();
    ctx.fill();
  }

  ctx.shadowColor = "#33f6ff";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.lineTo(w * 0.48, -h * 0.14);
  ctx.lineTo(w * 0.42, h * 0.38);
  ctx.lineTo(0, h / 2);
  ctx.lineTo(-w * 0.42, h * 0.38);
  ctx.lineTo(-w * 0.48, -h * 0.14);
  ctx.closePath();

  const body = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  body.addColorStop(0, "#33f6ff");
  body.addColorStop(0.5, "#f8fbff");
  body.addColorStop(1, "#ff3df2");
  ctx.fillStyle = body;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(5, 7, 17, 0.7)";
  roundedRect(ctx, -w * 0.23, -h * 0.28, w * 0.46, h * 0.28, 6);
  ctx.fill();

  ctx.fillStyle = "#050711";
  ctx.fillRect(-w * 0.54, -h * 0.18, w * 0.13, h * 0.48);
  ctx.fillRect(w * 0.41, -h * 0.18, w * 0.13, h * 0.48);

  ctx.shadowColor = "#a9ff4f";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#a9ff4f";
  ctx.fillRect(-w * 0.28, -h * 0.48, w * 0.18, 4);
  ctx.fillRect(w * 0.1, -h * 0.48, w * 0.18, 4);
  ctx.shadowBlur = 0;

  if (state.shield) {
    ctx.strokeStyle = "rgba(51, 246, 255, 0.9)";
    ctx.shadowColor = "#33f6ff";
    ctx.shadowBlur = 20;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.78, h * 0.62, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawParticles(ctx, state) {
  for (const particle of state.particles) {
    const alpha = clamp(particle.life / particle.maxLife, 0, 1) * particle.alpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawScene(ctx, state, dim, phase) {
  ctx.setTransform(dim.dpr, 0, 0, dim.dpr, 0, 0);
  ctx.clearRect(0, 0, dim.width, dim.height);
  drawSky(ctx, state, dim);
  drawSkyline(ctx, state, dim, {
    alpha: 0.58,
    bottom: "#07101f",
    maxHeight: 0.48,
    minHeight: 0.22,
    seed: 14,
    spacing: 74,
    speed: 0.08,
    top: "#122241",
    window: "#33f6ff",
    yOffset: 46,
  });
  drawSkyline(ctx, state, dim, {
    alpha: 0.86,
    bottom: "#070912",
    maxHeight: 0.36,
    minHeight: 0.16,
    seed: 91,
    spacing: 58,
    speed: 0.18,
    top: "#18223f",
    window: "#ff3df2",
    yOffset: 82,
  });

  ctx.save();
  if (state.shake > 0) {
    const amount = state.shake * 16;
    ctx.translate(randomBetween(-amount, amount), randomBetween(-amount, amount));
  }

  drawRoad(ctx, state, dim);

  const visibleItems = [...state.items].sort((a, b) => a.y - b.y);
  const visibleObstacles = [...state.obstacles].sort((a, b) => a.y - b.y);

  for (const item of visibleItems) {
    drawItem(ctx, item, dim, state.time);
  }

  for (const obstacle of visibleObstacles) {
    drawObstacle(ctx, obstacle, dim, state.time);
  }

  if (phase !== "gameOver" || state.ended) {
    drawPlayer(ctx, state);
  }

  drawParticles(ctx, state);
  ctx.restore();
}

export default function GameCanvas({
  difficulty,
  highScore,
  inputRef,
  onGameOver,
  onSound,
  onStats,
  phase,
  sessionId,
}) {
  const canvasRef = useRef(null);
  const callbacksRef = useRef({ onGameOver, onSound, onStats });
  const difficultyRef = useRef(difficulty);
  const dimensionRef = useRef({ dpr: 1, height: 720, width: 1280 });
  const highScoreRef = useRef(highScore);
  const phaseRef = useRef(phase);
  const stateRef = useRef(null);

  useEffect(() => {
    callbacksRef.current = { onGameOver, onSound, onStats };
  }, [onGameOver, onSound, onStats]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(320, rect.width);
      const height = Math.max(480, rect.height);

      dimensionRef.current = { dpr, height, width };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (!stateRef.current) {
        stateRef.current = createGameState(dimensionRef.current, difficultyRef.current);
      } else {
        adaptStateToResize(stateRef.current, dimensionRef.current);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    window.addEventListener("orientationchange", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", resize);
    };
  }, []);

  useEffect(() => {
    stateRef.current = createGameState(dimensionRef.current, difficulty);
    callbacksRef.current.onStats(formatStats(stateRef.current, highScoreRef.current));
  }, [difficulty, sessionId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    let frame = 0;
    let lastTime = performance.now();

    const tick = (time) => {
      const dt = clamp((time - lastTime) / 1000, 0, 0.034);
      lastTime = time;

      if (!stateRef.current) {
        stateRef.current = createGameState(dimensionRef.current, difficultyRef.current);
      }

      const state = stateRef.current;
      const currentPhase = phaseRef.current;

      if (currentPhase === "playing" && !state.ended) {
        updateGame(
          state,
          dt,
          dimensionRef.current,
          inputRef.current,
          callbacksRef.current,
          highScoreRef.current,
        );
      } else {
        updateAmbient(state, dt);
      }

      drawScene(ctx, state, dimensionRef.current, currentPhase);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [inputRef]);

  return (
    <div className="absolute inset-0">
      <canvas
        aria-label="Neon Drift Runner game canvas"
        className="game-canvas"
        ref={canvasRef}
      />
    </div>
  );
}
