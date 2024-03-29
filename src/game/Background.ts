import { canvasHeight, canvasWidth, winXPos } from "../constants";
import backgroundBack from "../assets/castle-back2-REVISED.png";
import backgroundFront from "../assets/Castle_first_background.png";
import instruction_page from "../assets/instructions-update3.png";
import { StateOfGame } from "./GameState";
import endGate from "../assets/end_gate.png";

// const levelText: string[][] = [
//   ["I am a sword.", "Might as well stick to what you’re good at..."],
//   ["Draw... me..."],
//   ["You should attack", "You're good at that"],
//   [
//     "You didn’t use me much",
//     "You could have used me.",
//     "I’m better than a shirt.",
//     "I’m a sword.",
//   ],
//   ["He’s evil"],
//   ["You are afraid"],
//   ["Just throw me in there", "If he’s evil, he’ll kill himself."],
// ];
const levelText: string[][] = [
  ["You will feel the weight of your sins..."],
  ["...Then you will lose touch with reality"],
  ["Now,", "it bends to your will."],
  ["They will persecute you harder"],
  ["Careful,", "or you'll become trapped in the moment"],
  ["But don't let the seconds", "slip through your fingers"],
  ["You've used me plenty", "Don't let me lose my edge"],
  ["I'm hungry", "Maybe I'll feast upon you"],
];
export class Background {
  private backgroundBack = new Image();
  private backgroundFront = new Image();
  private endGate = new Image();

  constructor() {
    this.backgroundBack.src = backgroundBack;
    this.backgroundFront.src = backgroundFront;
    this.endGate.src = endGate;
  }
  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.translate(offsetX * 0.8, 0);
    ctx.scale(2, 2);
    for (let i = -1; i < 10; i++) {
      ctx.drawImage(this.backgroundBack, i * this.backgroundBack.width, 0);
    }
    ctx.restore();

    ctx.save();
    ctx.translate(offsetX, 0);
    ctx.scale(2, 2);
    for (let i = -1; i < 50; i++) {
      ctx.drawImage(
        this.backgroundFront,
        i * this.backgroundFront.width * 1.85,
        0
      );
    }
    ctx.restore();
    // const;
    ctx.fillStyle = "rgb(46,46,46)";
    ctx.fillRect(offsetX + winXPos + 180, 0, 1000, canvasHeight);
    ctx.fillStyle = "#565656";
    const gradient = ctx.createLinearGradient(
      offsetX + winXPos + 180,
      0,
      offsetX + winXPos + 180 + 1000,
      0
    );

    gradient.addColorStop(0, "#46464600");
    gradient.addColorStop(0.8, "black");
    // gradient.addColorStop(0, "#464646");

    ctx.fillStyle = gradient;

    ctx.fillRect(offsetX + winXPos + 180, 0, 1000, canvasHeight);

    ctx.save();
    ctx.translate(offsetX + winXPos, 0);
    ctx.scale(2.52, 2.52);
    ctx.drawImage(this.endGate, 0, 0);
    ctx.restore();

    // Add the endgate image
  }

  dispLevelInfo(
    ctx: CanvasRenderingContext2D,
    level: number,
    gameState: StateOfGame
  ) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.textAlign = "center";
    ctx.fillStyle = "#800000";
    ctx.font = `50px Pirata One`;
    if (gameState === "levelIntro") {
      let lines;
      if (level >= levelText.length) {
        lines = ["You may have finished,", "but I'm still hungry."];
      } else {
        lines = levelText[level];
      }
      lines.forEach((line, i) => {
        ctx.fillText(line, canvasWidth / 2, canvasHeight / 2 + i * 50);
      });

      ctx.font = `30px Pirata One`;
      ctx.textAlign;
      // ctx.fillText("- Nightblood", canvasWidth * 0.66, canvasHeight / 2 + 200);
    } else if (gameState === "lostLevel") {
      ctx.font = `100px Pirata One`;
      ctx.fillText(`We need to try again.`, canvasWidth / 2, canvasHeight / 2);
    } else if (gameState === "showControls") {
      const controlImage = new Image();
      controlImage.src = instruction_page;
      ctx.drawImage(controlImage, 30, 30, canvasWidth - 30, canvasHeight - 30);
    } else {
      ctx.font = `100px Pirata One`;
      ctx.fillText(`You lost`, canvasWidth / 2, canvasHeight / 2);
    }
    ctx.restore();
  }
}
