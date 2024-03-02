import topIdle from "../assets/szeth_idle_(top).png";
import bottomIdle from "../assets/szeth_idle_(bottom).png";
import uplookIdle from "../assets/szeth_looking_up_(top).png";
import runningBottom from "../assets/szeth_running_(bottom).png";
import { playerDistFromLeft, playerHeight, playerWidth } from "../constants";
import { Player } from "./Player";
import { debounceLog } from "./helpers";

// const idleRaw = {
//   width: 400,
//   height: 650,
//   distFromLeft: 45,
//   distFromTop: 300,
// };

// idleScales keeps the ratio of width/height

const idleScales = {
  width: 200,
  height: 325,
  distFromLeft: 0,
  distFromTop: 150,
};

// 45, 400
export class PlayerDrawManager {
  images = {
    topIdle: new Image(idleScales.width, idleScales.height),
    bottomIdle: new Image(idleScales.width, idleScales.height),
    uplookIdle: new Image(idleScales.width, idleScales.height),
    runningBottom: new Image(idleScales.width, idleScales.height),
  } as const;

  constructor() {
    this.images.topIdle.src = topIdle;
    this.images.bottomIdle.src = bottomIdle;
    this.images.uplookIdle.src = uplookIdle;
    this.images.runningBottom.src = runningBottom;
  }

  drawTop(ctx: CanvasRenderingContext2D, player: Player) {
    const image =
      player.lookDirectionY === "up"
        ? this.images.uplookIdle
        : this.images.topIdle;

    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y + 30);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    ctx.drawImage(
      image,
      -idleScales.distFromLeft,
      -idleScales.distFromTop,
      image.width,
      image.height
    );
    ctx.restore();
  }

  drawBottom(ctx: CanvasRenderingContext2D, player: Player) {
    const isRunning = player.vel.x !== 0;
    const image = isRunning
      ? this.images.runningBottom
      : this.images.bottomIdle;

    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y + playerHeight / 2 - 10);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }

    const runningSpriteCount = 6;
    const whichSprite = 0;
    if (isRunning) {
      const dx = -idleScales.distFromLeft;
      const dy = -idleScales.distFromTop;
      const dWidth = idleScales.width;
      const dHeight = idleScales.height;
      const sx = whichSprite;
      const sWidth = idleScales.width;
      const sHeight = idleScales.height;
      debounceLog(image.width);

      ctx.drawImage(
        image,
        0, // which sprite x
        0,
        200,
        325,
        dx,
        dy,
        dWidth,
        dHeight
      );
    } else {
      ctx.drawImage(
        image,
        0, // sx
        0, // sy
        image.width, // sw
        image.height, // sh
        -idleScales.distFromLeft,
        -idleScales.distFromTop,
        image.width,
        image.height
      );
    }
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.translate(playerDistFromLeft, player.pos.y);
    ctx.fillRect(0, 0, playerHeight, playerWidth);
    ctx.restore();

    this.drawBottom(ctx, player);
    this.drawTop(ctx, player);
  }
}
