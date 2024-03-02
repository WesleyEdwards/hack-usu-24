import topIdle from "../assets/szeth_idle_(top).png";
import bottomIdle from "../assets/szeth_idle_(bottom).png";
import uplookIdle from "../assets/szeth_looking_up_(top).png";
import runningBottom from "../assets/szeth_running_(bottom).png";
import runningTop from "../assets/szeth_running_(top).png";
import { playerDistFromLeft, playerHeight, playerWidth } from "../constants";
import { Player } from "./Player";
import { debounceLog } from "./helpers";

const idleScales = {
  distFromRight: 20,
  distFromBottom: 265,
};

const scaleFactor = 0.65;

const runningSpriteCount = 6;

const runningSpriteFrequency = 100;

export class PlayerDrawManager {
  topIdle = new Image();
  bottomIdle = new Image();
  uplookIdle = new Image();
  runningBottom = new Image();
  runningTop = new Image();
  runTimer = 0;

  constructor() {
    this.topIdle.src = topIdle;
    this.bottomIdle.src = bottomIdle;
    this.uplookIdle.src = uplookIdle;
    this.runningBottom.src = runningBottom;
    this.runningTop.src = runningTop;
  }

  update(deltaTime: number) {
    this.runTimer += deltaTime;
  }

  playerTop(ctx: CanvasRenderingContext2D, player: Player) {
    const isRunning = player.vel.x !== 0;
    const image = (() => {
      if (player.lookDirectionY === "up") return this.uplookIdle;
      if (isRunning) return this.runningTop;
      return this.topIdle;
    })();
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    ctx.scale(scaleFactor, scaleFactor);

    if (isRunning && player.lookDirectionY !== "up") {
      const spriteIndex =
        Math.floor(this.runTimer / runningSpriteFrequency) % runningSpriteCount;
      ctx.drawImage(
        image,
        (spriteIndex * image.width) / runningSpriteCount,
        0,
        image.width / runningSpriteCount,
        image.height,
        -idleScales.distFromRight,
        -idleScales.distFromBottom,
        image.width / runningSpriteCount,
        image.height
      );
    } else {
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        -idleScales.distFromRight,
        -idleScales.distFromBottom,
        image.width,
        image.height
      );
    }

    ctx.restore();
  }

  playerBottom(ctx: CanvasRenderingContext2D, player: Player) {
    const isRunning = player.vel.x !== 0;
    if (!isRunning) this.runTimer = 0;
    const image = isRunning ? this.runningBottom : this.bottomIdle;
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    ctx.scale(scaleFactor, scaleFactor);

    if (isRunning) {
      const spriteIndex =
        Math.floor(this.runTimer / runningSpriteFrequency) % runningSpriteCount;
      ctx.drawImage(
        image,
        (spriteIndex * image.width) / runningSpriteCount,
        0,
        image.width / runningSpriteCount,
        image.height,
        -idleScales.distFromRight,
        -idleScales.distFromBottom,
        image.width / runningSpriteCount,
        image.height
      );
    } else {
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        -idleScales.distFromRight,
        -idleScales.distFromBottom,
        image.width,
        image.height
      );
    }
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.fillStyle = "red";
    ctx.fillRect(playerDistFromLeft, player.pos.y, playerWidth, playerHeight);

    this.playerBottom(ctx, player);
    this.playerTop(ctx, player);
  }
}
