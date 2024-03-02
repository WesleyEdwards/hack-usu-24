import { platformHeight } from "../constants";
import { Coor } from "./types";

export class Platform {
  pos: Coor;
  constructor(
    initPos: Coor,
    public width: number = 100,
    public floor: boolean = false
  ) {
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
