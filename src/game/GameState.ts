import { Background } from "./Background";
import { Fused } from "./Fused";
import { Parshendi } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { Keys, addEventListeners } from "./eventListeners";
import { getLevelInfo } from "./levelInfo";

export const playerDistFromLeft = 200;

export class GameState {
  player = new Player();
  fused: Fused[];
  parshendi: Parshendi[];
  background = new Background();
  platforms: Platform[];
  keys: Keys;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.keys = addEventListeners();
    const level = getLevelInfo(0);
    this.platforms = level.blockProps.map((props) => new Platform(props));
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
  }

  reset() {
    const level = getLevelInfo(0);
    this.player = new Player();
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
  }

  update(deltaTime: number) {
    this.player.update(deltaTime, this.keys);
    this.fused.forEach((f) => f.update(deltaTime));
    this.parshendi.forEach((p) => p.update(deltaTime));
  }

  draw() {
    this.background.draw(this.ctx);
    this.platforms.forEach((p) => p.draw(this.ctx, this.offsetX));
    this.fused.forEach((f) => f.draw(this.ctx));
    this.parshendi.forEach((p) => p.draw(this.ctx));
    this.player.draw(this.ctx);
  }

  get offsetX() {
    return playerDistFromLeft - this.player.pos.x;
  }
}
