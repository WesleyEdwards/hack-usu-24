import { Coor } from "./types";

const platformHeight = 30;

export class Platform {
  pos: Coor;
  constructor(initPos: Coor, public floor: boolean = false) {
    this.pos = initPos;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(this.pos.x + offsetX, this.pos.y);
    ctx.fillRect(0, 0, 200, platformHeight);
    ctx.restore();
  }
}
