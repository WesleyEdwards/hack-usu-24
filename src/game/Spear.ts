import { Coor } from "./types";
import { canvasHeight, gravity } from "../constants";
import spearImage from "../assets/thrown_spear.png";
import {
  createVector,
  multiplyVectorConstant,
  normalizeVector,
} from "./miscFunctions";
export const spearWidth = 50;
export const spearHeight = 20;
export const spearSpeed = 600;

export type SpearProps = {
  initPos: Coor;
  dest: Coor;
};

export class Spear {
  pos: Coor;
  prevPos: Coor;
  vel: Coor;
  live = true;
  img = new Image();

  get center(): Coor {
    return { x: this.pos.x + spearWidth / 2, y: this.pos.y + spearWidth / 2 };
  }
  constructor(props: SpearProps) {
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };
    this.vel = multiplyVectorConstant(
      normalizeVector(createVector(this.pos, props.dest)),
      spearSpeed
    );
    this.img.src = spearImage;
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    // handle gravity
    this.vel.y += ((gravity / 10) * deltaTime) / 1000;
    // debounceLog(this.pos)
    this.pos.y += (this.vel.y * deltaTime) / 1000;
    this.pos.x += (this.vel.x * deltaTime) / 1000;
    if (
      this.pos.y + spearHeight > canvasHeight + spearHeight ||
      this.pos.y + spearHeight < 0
    ) {
      this.live = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.translate(this.center.x + offsetX, this.center.y);
    ctx.rotate(Math.atan2(this.vel.y, this.vel.x));
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(0, 0, spearWidth, spearHeight);
    ctx.scale(4, 4);
    ctx.drawImage(
      this.img,
      -spearWidth / 2,
      -spearHeight / 2,
      spearWidth,
      spearHeight
    );
    ctx.restore();
  }
}
