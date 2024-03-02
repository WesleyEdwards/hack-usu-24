import { levelTimerTime, playerDistFromLeft, winXPos } from "../constants";
import { Background } from "./Background";
import { Fused } from "./Fused";
import { Parshendi } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { Keys, addEventListeners } from "./eventListeners";
import { getLevelInfo } from "./levelInfo";
import { calculatePlayerPlatCollision } from "./miscFunctions";

export class GameState {
  player = new Player();
  fused: Fused[];
  parshendi: Parshendi[];
  background = new Background();
  platforms: Platform[];
  keys: Keys;
  gameState: "playing" | "levelIntro" = "levelIntro";
  levelTimer = 0;
  level = 0;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.keys = addEventListeners();
    const level = getLevelInfo(this.level);
    this.platforms = level.platProps.map((props) => new Platform(props));
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
  }

  reset() {
    this.levelTimer = 0;
    const level = getLevelInfo(this.level);
    this.player = new Player();
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
  }

  update(deltaTime: number) {
    this.levelTimer += deltaTime;
    if (this.levelTimer > levelTimerTime) {
      this.gameState = "playing";
    }
    if (this.gameState === "levelIntro") {
      return;
    }
    this.player.update(deltaTime, this.keys);
    this.fused.forEach((f) => f.update(deltaTime));
    this.parshendi.forEach((p) => p.update(deltaTime));
    calculatePlayerPlatCollision(this.player, this.platforms, this.keys.down);
    if (this.player.pos.x > winXPos) {
      this.level++;
      this.reset();
      this.gameState = "levelIntro";
      this.levelTimer = 0;
    }
  }

  draw() {
    if (this.gameState === "levelIntro") {
      this.background.dispLevelInfo(this.ctx, this.level);
    } else {
      this.background.draw(this.ctx, this.offsetX);
      this.platforms.forEach((p) => p.draw(this.ctx, this.offsetX));

      this.fused.forEach((f) => f.draw(this.ctx, this.offsetX));
      this.parshendi.forEach((p) => p.draw(this.ctx, this.offsetX));
      this.player.draw(this.ctx);
    }
  }

  get offsetX() {
    return playerDistFromLeft - this.player.pos.x;
  }
}
