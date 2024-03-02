import { Coor } from "./types";
import { canvasHeight, gravity } from "../constants";
import { debounceLog } from "./helpers";
import {
  createVector,
  multiplyVectorConstant,
  normalizeVector,
} from "./miscFunctions";

export type ShootProps = { initPos: Coor; vel: Coor };

export class PlayerShoot {
  pos: Coor;
  prevPos: Coor;
  vel: Coor;
  live = true;

  constructor(props: ShootProps) {
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };
    this.vel = { ...props.vel };
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    this.pos.y += (this.vel.y * deltaTime) / 1000;
    this.pos.x += (this.vel.x * deltaTime) / 1000;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.translate(this.pos.x + offsetX, this.pos.y);
    ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, 30, 30);
    // Draw a circle that fades out towards the edges
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    // 0 makes it fully transparent, 1 makes it fully opaque
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 1)");

    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
