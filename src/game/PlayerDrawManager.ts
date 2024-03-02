import topIdle from "../assets/szeth_idle_(top).png";
import bottomIdle from "../assets/szeth_idle_(bottom).png";
import uplookIdle from "../assets/szeth_looking_up_(top).png";
import runningBottom from "../assets/szeth_running_(bottom).png";
import { playerDistFromLeft, playerHeight, playerWidth } from "../constants";
import { Player } from "./Player";
import { debounceLog } from "./helpers";

const idleScales = {
  distFromRight: 20,
  distFromBottom: 265,
};

const scaleFactor = 0.65;

const runningBottomSpriteCount = 6;

const runningSpriteFrequency = 100;

export class PlayerDrawManager {
  topIdle = new Image();
  bottomIdle = new Image();
  uplookIdle = new Image();
  runningBottom = new Image();
  bottomTimer = 0;

  constructor() {
    this.topIdle.src = topIdle;
    this.bottomIdle.src = bottomIdle;
    this.uplookIdle.src = uplookIdle;
    this.runningBottom.src = runningBottom;
  }

  update(deltaTime: number) {
    this.bottomTimer += deltaTime;
  }

  playerTop(ctx: CanvasRenderingContext2D, player: Player) {
    const image =
      player.lookDirectionY === "up" ? this.uplookIdle : this.topIdle;
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    ctx.scale(scaleFactor, scaleFactor);
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

    ctx.restore();
  }

  playerBottom(ctx: CanvasRenderingContext2D, player: Player) {
    // const image = this.bottomIdle;

    const isRunning = player.vel.x !== 0;
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
        Math.floor(this.bottomTimer / runningSpriteFrequency) %
        runningBottomSpriteCount;
      debounceLog(spriteIndex);
      ctx.drawImage(
        image,
        (spriteIndex * image.width) / runningBottomSpriteCount,
        0,
        image.width / runningBottomSpriteCount,
        image.height,
        -idleScales.distFromRight,
        -idleScales.distFromBottom,
        image.width / runningBottomSpriteCount,
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
    debounceLog(player.pos);

    ctx.fillStyle = "red";
    ctx.fillRect(playerDistFromLeft, player.pos.y, playerWidth, playerHeight);

    this.playerBottom(ctx, player);
    this.playerTop(ctx, player);
  }
}
