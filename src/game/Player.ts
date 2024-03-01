import { playerDistFromLeft } from "./GameState";
import { Coor } from "./types";

const playerWidth = 100;
const playerHeight = 100;

const playerInitPos: Coor = {
  x: 200,
  y: 200,
};

export class Player {
  pos: Coor;
  prevPos: Coor;

  constructor() {
    this.prevPos = { ...playerInitPos };
    this.pos = { ...playerInitPos };
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    this.pos.x += 1 / deltaTime;
    this.pos.y += 1 / deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.translate(playerDistFromLeft, this.pos.y);
    ctx.fillRect(0, 0, playerWidth, playerHeight);
    ctx.restore();
  }
}
