import { canvasHeight, canvasWidth } from "../constants";
import bricks from "../assets/grey-wall.jpg";

export class Background {
  private image = new Image();

  constructor() {
    this.image.src = bricks;
  }
  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();

    ctx.translate(-offsetX, 0);
    for (let i = 0; i < canvasWidth / this.image.width; i++) {
      ctx.drawImage(this.image, i * this.image.width, 0);
    }

    // ctx.drawImage(this.image, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }
}
