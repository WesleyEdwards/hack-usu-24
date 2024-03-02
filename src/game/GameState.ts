import { Background } from "./Background";
import { Fused } from "./Fused";
import { Parshendi } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";

export const playerDistFromLeft = 200;

export class GameState {
  player = new Player();
  fused: Fused[] = [
    new Fused({ x: 200, y: 200 }),
    new Fused({ x: 200, y: 300 }),
  ];
  parshendi: Parshendi[] = [new Parshendi({ x: 300, y: 400 })];
  background = new Background();
  platforms: Platform[] = [];

  constructor(private ctx: CanvasRenderingContext2D) {}

  update(deltaTime: number) {
    this.player.update(deltaTime);
    this.fused.forEach((f) => f.update(deltaTime));
    this.parshendi.forEach((p) => p.update(deltaTime));
  }

  draw() {
    this.background.draw(this.ctx);
    this.player.draw(this.ctx);
    this.fused.forEach((f) => f.draw(this.ctx));
    this.parshendi.forEach((p) => p.draw(this.ctx));
  }

  get offsetX() {
    return playerDistFromLeft - this.player.pos.x;
  }
}
