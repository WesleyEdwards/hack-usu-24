import { Coor } from "./types";

const fusedWidth = 100;
const fusedHeight = 100;

export class Fused {
  pos: Coor;
  prevPos: Coor;

  constructor(initPos: Coor) {
    this.prevPos = initPos;
    this.pos = initPos;
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    this.pos.x += 1 / deltaTime;
    this.pos.y += 1 / deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(this.pos.x, this.pos.y);
    ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    ctx.restore();
  }
}
