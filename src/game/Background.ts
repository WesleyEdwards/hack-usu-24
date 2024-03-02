import { canvasHeight, canvasWidth } from "../constants";
import bricks from "../assets/grey-wall.jpg";

export class Background {
  private image = new Image();

  constructor() {
    this.image.src = bricks;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.drawImage(this.image, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }
}
