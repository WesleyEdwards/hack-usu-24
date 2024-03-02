import { Coor } from "./types";
import { canvasHeight, gravity } from "../constants";
import { debounceLog } from "./helpers";
import { createVector, eucDistance, multiplyVectorConstant, normalizeVector } from "./miscFunctions";
export const spearWidth = 50;
export const spearHeight = 20;
export const spearSpeed = 300;

export type SpearProps = {
  initPos: Coor;
  dest: Coor;
};

export class Spear {
  pos: Coor;
  prevPos: Coor;
  vel: Coor;
  live = true;

  get center():Coor{
    return {x:this.pos.x+spearWidth/2, y:this.pos.y+spearWidth/2}
  }
  constructor(props: SpearProps) {
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };
    this.vel = multiplyVectorConstant(normalizeVector(createVector(this.pos, props.dest)),spearSpeed)
}

update(deltaTime: number) {
    debounceLog(this.pos);
    this.prevPos = { ...this.pos };
    // debounceLog(this.pos)
    this.pos.y += (this.vel.y * deltaTime) / 1000;
    this.pos.x += (this.vel.x * deltaTime) / 1000;
    if (this.pos.y + spearHeight > canvasHeight+spearHeight ||
        this.pos.y + spearHeight < 0 ) {
      this.live = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "yellow";
    ctx.translate(this.pos.x + offsetX, this.pos.y);
    ctx.fillRect(0, 0, spearWidth, spearHeight);
    ctx.restore();
  }
}
