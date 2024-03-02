import fusedIdle from "../assets/fused_(idle).png";
import { fusedHeight, fusedWidth } from "../constants";
import { Fused } from "./Fused";

const idleScales = {
  distFromRight: 20,
  distFromBottom: 20,
};

const idleSpriteCount = 6;

export class FusedDrawManager {
  idle = new Image();
  spriteTimer = 0;
  constructor() {
    this.idle.src = fusedIdle;
  }

  update(deltaTime: number) {
    this.spriteTimer += deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D, fused: Fused, offsetX: number) {
    const pos = {
      x: fused.pos.x + offsetX,
      y: fused.pos.y,
    };

    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(pos.x, pos.y);
    ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    ctx.restore();

    ctx.save();
    ctx.translate(pos.x, pos.y);
    // ctx.scale(0.5, 0.5);
    if (fused.facing === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-100, 0);
    }
    const whichSprite = Math.floor(this.spriteTimer / 100) % idleSpriteCount;
    ctx.drawImage(
      this.idle,
      (whichSprite * this.idle.width) / idleSpriteCount,
      0,
      this.idle.width / idleSpriteCount,
      this.idle.height,
      -idleScales.distFromRight,
      -idleScales.distFromBottom,
      this.idle.width / idleSpriteCount,
      this.idle.height
    );
    ctx.restore();
  }
}
