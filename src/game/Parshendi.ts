import { Coor } from "./types";

const parshendiWidth = 100;
const parshendiHeight = 100;

export class Parshendi {
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

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "green";
    ctx.translate(this.pos.x+offsetX, this.pos.y);
    ctx.fillRect(0, 0, parshendiWidth, parshendiHeight);
    ctx.restore();
  }
}
