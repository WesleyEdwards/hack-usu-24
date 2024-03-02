import { canvasHeight, canvasWidth, winXPos } from "../constants";
import bricks from "../assets/grey-wall.jpg";

const levelText: string[][] = [
  ["I am a sword.", "Might as well stick to what you’re good at..."],
  ["Draw... me..."],
  ["You should attack", "You're good at that"],
  [
    "You didn’t use me much",
    "You could have used me.",
    "I’m better than a shirt.",
    "I’m a sword.",
  ],
  ["He’s evil"],
  ["You are afraid"],
  ["Just throw me in there", "If he’s evil, he’ll kill himself."],
];
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
    ctx.fillStyle = "#800000";
    ctx.fillRect(offsetX + winXPos, 0, 4000, canvasHeight);
  }

  dispLevelInfo(ctx: CanvasRenderingContext2D, level: number) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.textAlign = "center";
    ctx.fillStyle = "#800000";
    ctx.font = `50px Pirata One`;
    const lines = levelText[level];
    lines.forEach((line, i) => {
      ctx.fillText(line, canvasWidth / 2, canvasHeight / 2 + i * 50);
    });
    ctx.restore();
  }
}
