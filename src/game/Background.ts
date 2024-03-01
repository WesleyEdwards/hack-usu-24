import { canvasHeight, canvasWidth } from "../App";

export class Background {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }
}
