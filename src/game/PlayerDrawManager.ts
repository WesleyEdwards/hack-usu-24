import topIdle from "../assets/szeth_idle_(top).png";
import bottomIdle from "../assets/szeth_idle_(bottom).png";
import uplookIdle from "../assets/szeth_looking_up_(top).png";
import runningBottom from "../assets/szeth_running_(bottom).png";
import { playerDistFromLeft, playerHeight, playerWidth } from "../constants";
import { Player } from "./Player";
import { debounceLog } from "./helpers";

const idleScales = {
  width: 400,
  height: 650,
  distFromRight: 20,
  distFromBottom: 265,
};

// idleScales keeps the ratio of width/height

// const idleScales = {
//   width: 200,
//   height: 325,
//   distFromLeft: 33,
//   distFromTop: 300,
// };

// 45, 400

const scaleFactor = 0.65;
export class PlayerDrawManager {
  topIdle = new Image();
  bottomIdle = new Image();

  constructor() {
    this.topIdle.src = topIdle;
    // this.scaleImageKeepAspectRatio(this.topIdle, 1.5);
    this.bottomIdle.src = bottomIdle;
    // this.scaleImageKeepAspectRatio(this.bottomIdle, 0.5);
  }

  playerBottom(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(
      this.bottomIdle,
      0,
      0,
      this.bottomIdle.width,
      this.bottomIdle.height,
      -idleScales.distFromRight,
      -idleScales.distFromBottom,
      this.bottomIdle.width,
      this.bottomIdle.height
    );
    ctx.restore();
  }

  playerTop(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.save();
    ctx.translate(playerDistFromLeft, player.pos.y);
    if (player.lookDirectionX === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-playerWidth, 0);
    }
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(
      this.topIdle,
      0,
      0,
      this.topIdle.width,
      this.topIdle.height,
      -idleScales.distFromRight,
      -idleScales.distFromBottom,
      this.topIdle.width,
      this.topIdle.height
    );

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
