import { playerHeight, playerWidth } from "../constants";
import { Fused } from "./Fused";
import { Parshendi, parshendiHeight, parshendiWidth } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { PlayerShoot } from "./PlayerShoot";
import { Spear } from "./Spear";
import { Coor } from "./types";

export function calculatePlayerPlatCollision(
  player: Player,
  plat: Platform[],
  keyDown: boolean
) {
  plat.forEach((p) => {
    const leftRight =
      player.pos.x < p.pos.x + p.width && player.pos.x + playerWidth > p.pos.x;
    const topBottom =
      player.pos.y + playerHeight >= p.pos.y &&
      player.prevPos.y + playerHeight <= p.pos.y;

    if (!p.floor && keyDown) {
      return false;
    }
    if (leftRight && topBottom) {
      player.setOnPlatform(p.pos.y);
      return true;
    }
    return false;
  });
}

export function calculateParshendiPlatCollision(
  parshendi: Parshendi[],
  plat: Platform[]
) {
  plat.forEach((p) => {
    parshendi.forEach((par) => {
      const leftRight =
        par.pos.x < p.pos.x + p.width && par.pos.x + parshendiWidth > p.pos.x;
      const topBottom =
        par.pos.y + parshendiHeight >= p.pos.y &&
        par.prevPos.y + parshendiHeight <= p.pos.y;

      if (leftRight && topBottom) {
        par.setOnPlatform(p.pos.y);
        return true;
      }
      return false;
    });
  });
}

export function calculateParshendiSpear(
  parshendi: Parshendi[],
  player_pos: Coor,
  spears: Spear[],
  deltaTime: number
): boolean {
  parshendi.forEach((p) => {
    p.shouldThrow(player_pos, deltaTime, spears);
  });
  const hitPlayer = spears.find(
    (s) =>
      s.center.x < player_pos.x + playerWidth &&
      s.center.x > player_pos.x &&
      s.center.y < player_pos.y + playerHeight &&
      s.center.y > player_pos.y
  );
  return !!hitPlayer;
}

export function calculateFusedSpear(
  fused: Fused[],
  player_pos: Coor,
  spears: Spear[],
  deltaTime: number
) {
  fused.forEach((f) => {
    f.shouldThrow(player_pos, deltaTime, spears);
  });
}

export function calculateFuseShootCollision(
  fused: Fused[],
  playerShoot: PlayerShoot | null
) {
  if (!playerShoot) return;
  fused.forEach((f) => {
    const hit = eucDistance(f.center, playerShoot.center) < 100;
    if (hit) {
      f.hit();
      playerShoot.live = false;
    }
  });
}

export function calculateParshendiShootCollision(
  parshendi: Parshendi[],
  playerShoot: PlayerShoot | null
) {
  if (!playerShoot) return;
  parshendi.forEach((f) => {
    const hit = eucDistance(f.center, playerShoot.center) < 100;
    if (hit) {
      f.hit();
      playerShoot.live = false;
    }
  });
}

export function calculatePlayerEnemyCollision(
  player: Player,
  fused: Fused[],
  parshendi: Parshendi[]
): boolean {
  const hitFused = fused.find(
    (f) => eucDistance(f.center, player.center) < 100
  );
  const hitParshendi = parshendi.find(
    (p) => eucDistance(p.center, player.center) < 100
  );
  return !!hitFused || !!hitParshendi;
}

export function eucDistance(p1: Coor, p2: Coor) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function createVector(p1: Coor, p2: Coor): Coor {
  return { x: p2.x - p1.x, y: p2.y - p1.y };
}

export function normalizeVector(v: Coor) {
  const h = eucDistance(v, { x: 0, y: 0 });
  v.x = v.x / h;
  v.y = v.y / h;
  return v;
}

export function multiplyVectorConstant(v: Coor, c: number) {
  v.x = v.x * c;
  v.y = v.y * c;
  return v;
}
