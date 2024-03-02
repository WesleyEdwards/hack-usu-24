import topIdle from "../assets/szeth_idle_(top).png";
import bottomIdle from "../assets/szeth_idle_(bottom).png";
import uplookIdle from "../assets/szeth_looking_up_(top).png";
import runningBottom from "../assets/szeth_running_(bottom).png";
import runningTop from "../assets/szeth_running_(top).png";
import hittingSide from "../assets/szeth_attack_side.png";
import upHit from "../assets/szeth_attack_up.png";
import { playerDistFromLeft, playerHeight, playerWidth } from "../constants";
import { Player } from "./Player";

const hitSpriteTimer = 300;
const hitSpriteCount = 4;
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
  hittingSide = new Image();
  upHit = new Image();
  runTimer = 1000;
  hitTimer = 1000;

  constructor() {
    this.topIdle.src = topIdle;
    this.bottomIdle.src = bottomIdle;
    this.uplookIdle.src = uplookIdle;
    this.runningBottom.src = runningBottom;
    this.runningTop.src = runningTop;
    this.hittingSide.src = hittingSide;
    this.upHit.src = upHit;
  }

  update(deltaTime: number) {
    this.runTimer += deltaTime;
    this.hitTimer += deltaTime;
  }

  playerTop(ctx: CanvasRenderingContext2D, player: Player) {
    const isRunning = player.vel.x !== 0;
    const hitting = this.hitTimer < hitSpriteTimer;
    const image = (() => {
      const lookUp = player.lookDirectionY === "up";
      if (hitting && lookUp) return this.upHit;
      if (lookUp) return this.uplookIdle;
      if (hitting) return this.hittingSide;
      if (isRunning) return this.runningTop;
      return this.topIdle;
    })();
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    // Draw health bar
    ctx.fillStyle = `rgba(40,40,40,${player.life_opacity})`;
    ctx.fillRect(0, -10, playerWidth, 10);
    ctx.fillStyle = `rgba(0,255,0,${player.life_opacity})`;
    // debounceLog(playerWidth-2 * player.health/100)
    ctx.fillRect(1, -9, ((playerWidth - 2) * player.health) / 100, 8);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    if (window.gravity < 0) {
      ctx.scale(1, -1);
      ctx.translate(0, -playerHeight);
    }
    ctx.scale(scaleFactor, scaleFactor);

    if (hitting) {
      const spriteIndex = Math.floor(this.hitTimer / (hitSpriteTimer / 4));
      ctx.drawImage(
        image,
        (spriteIndex * image.width) / hitSpriteCount,
        0,
        image.width / hitSpriteCount,
        image.height,
        -idleScales.distFromRight,
        -idleScales.distFromBottom,
        image.width / hitSpriteCount,
        image.height
      );
      ctx.restore();
      return;
    } else if (isRunning && player.lookDirectionY !== "up") {
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
    if (window.gravity < 0) {
      ctx.scale(1, -1)
      ctx.translate(0, -playerHeight);
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
    // ctx.fillStyle = "red";
    // ctx.fillRect(playerDistFromLeft, player.pos.y, playerWidth, playerHeight);
    this.playerBottom(ctx, player);
    this.playerTop(ctx, player);
  }
}
