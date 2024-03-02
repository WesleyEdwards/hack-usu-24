import { fusedHeight, fusedWidth } from "../constants";
import armoredWalk from "../assets/Armored_parshendi_walk.png";
import { Parshendi } from "./Parshendi";

const idleScales = {
  distFromRight: 20,
  distFromBottom: 20,
};

const idleSpriteCount = 6;

export class ParshendiDrawManager {
  idle = new Image();
  spriteTimer = 0;
  constructor() {
    this.idle.src = armoredWalk;
  }

  update(deltaTime: number) {
    this.spriteTimer += deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D, parshendi: Parshendi, offsetX: number) {
    const pos = {
      x: parshendi.pos.x + offsetX,
      y: parshendi.pos.y,
    };

    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(pos.x, pos.y);
    ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    ctx.restore();

    ctx.save();
    ctx.translate(pos.x, pos.y);
    // ctx.scale(0.5, 0.5);
    if (parshendi.facing === "left") {
      ctx.scale(-1, 1);
      ctx.translate(-100, 0);
    }

    if (window.gravity < 0) {
      ctx.scale(1, -1);
      ctx.translate(0, -fusedHeight);
    }

    const whichSprite = Math.floor(this.spriteTimer / 100) % idleSpriteCount;
    ctx.scale(0.75, 0.75);
    ctx.translate(0, 4); // hacky hacky
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
