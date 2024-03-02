import fusedIdle from "../assets/fused_(idle).png";
import throwing from "../assets/fused_throw.png";
import { fusedHeight } from "../constants";
import { Fused } from "./Fused";

const idleScales = {
  distFromRight: 20,
  distFromBottom: 20,
};

// const idleSpriteCount = 6;

export class FusedDrawManager {
  idle = new Image();
  throwing = new Image();
  spriteTimer = 0;
  throwTimer = 0;
  constructor() {
    this.idle.src = fusedIdle;
    this.throwing.src = throwing;
  }

  update(deltaTime: number) {
    this.spriteTimer += deltaTime;
    this.throwTimer += deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D, fused: Fused, offsetX: number) {
    const pos = {
      x: fused.pos.x + offsetX,
      y: fused.pos.y,
    };

    // ctx.save();
    // ctx.fillStyle = "red";
    // ctx.translate(pos.x, pos.y);
    // ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    // ctx.restore();

    ctx.save();
    ctx.translate(pos.x, pos.y);
    // ctx.scale(0.5, 0.5);
    if (fused.facing === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-100, 0);
    }
    const showThrowing = this.throwTimer < 400;
    const image = showThrowing ? this.throwing : this.idle;

    if (window.gravity < 0) {
      ctx.scale(1, -1);
      ctx.translate(0, -fusedHeight);
    }

    const idleSpriteCount = showThrowing ? 3 : 6;

    const whichSprite = Math.floor(this.spriteTimer / 100) % idleSpriteCount;
    ctx.drawImage(
      image,
      (whichSprite * image.width) / idleSpriteCount,
      0,
      image.width / idleSpriteCount,
      image.height,
      -idleScales.distFromRight,
      -idleScales.distFromBottom,
      image.width / idleSpriteCount,
      image.height
    );
    ctx.restore();
  }
}
