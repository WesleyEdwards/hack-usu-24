import { canvasHeight, canvasWidth } from "../constants";
import bricks from "../assets/grey-wall.jpg";

const levelText = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
export class Background {
  private image = new Image();

  constructor() {
    this.image.src = bricks;
  }
  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();

    ctx.translate(offsetX, 0);
    for (let i = -1; i < 10; i++) {
      ctx.drawImage(this.image, i * this.image.width, 0);
    }

    // ctx.drawImage(this.image, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }

  dispLevelInfo(ctx: CanvasRenderingContext2D, level: number) {
    const levelInfo = levelText.at(level) ?? levelText[0];
    const levelInfoSize = 90;
    const levelInfoFont = "Pirata One";
    const levelInfoX = canvasWidth / 2 - levelInfoSize * 2;
    const levelInfoY = canvasHeight / 2 - levelInfoSize * 2;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "grey";
    ctx.font = `${levelInfoSize}px ${levelInfoFont}`;
    ctx.fillText(levelInfo, levelInfoX, levelInfoY);
    ctx.restore();
  }
}
