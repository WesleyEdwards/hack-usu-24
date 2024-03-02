import { Background } from "./Background";
import { Fused } from "./Fused";
import { Parshendi } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { Keys, addEventListeners } from "./eventListeners";

export const playerDistFromLeft = 200;

const initialFusedProps = [
  { x: 200, y: 200 },
  { x: 200, y: 300 },
];

const initialParshendiProps = [{ x: 300, y: 400 }];

const initialBlockProps = [
  { x: 0, y: 600, width: 1245, height: 100 },
  { x: 0, y: 400, width: 100, height: 200 },
  { x: 1145, y: 400, width: 100, height: 200 },
  { x: 200, y: 300, width: 100, height: 100 },
  { x: 200, y: 500, width: 100, height: 100 },
  { x: 945, y: 300, width: 100, height: 100 },
  { x: 945, y: 500, width: 100, height: 100 },
];

export class GameState {
  player = new Player();
  fused: Fused[] = initialFusedProps.map((props) => new Fused(props));
  parshendi: Parshendi[] = initialParshendiProps.map(
    (props) => new Parshendi(props)
  );
  background = new Background();
  platforms: Platform[] = initialBlockProps.map((props) => new Platform(props));
  keys: Keys;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.keys = addEventListeners();
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
