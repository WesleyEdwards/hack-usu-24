import { Coor } from "./types";
import { canvasHeight, canvasWidth } from "../constants";
const fusedWidth = 100;
const fusedHeight = 100;
const y_range = fusedHeight*2;
const x_range = fusedWidth/2;
const max_speed = 150;

export class Fused {
  pos: Coor;
  prevPos: Coor;
  x_vel=max_speed/2;
  y_vel=max_speed;
  trackPos = {x:0, y:0};

  constructor(initPos: Coor) {
    this.prevPos = initPos;
    this.pos = initPos;
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    let deltaX = this.x_vel * deltaTime/1000;
    let deltaY = this.y_vel * deltaTime/1000;
    if ((deltaX + this.trackPos.x) >= x_range || (deltaX + this.trackPos.x) <= 0) {
      if (deltaX > 0) {
        deltaX = x_range - this.trackPos.x;
      } else {
        deltaX = 0 - this.trackPos.x;
      }
      this.x_vel = -this.x_vel
    }
    if ((deltaY + this.trackPos.y) >= y_range || (deltaY + this.trackPos.y) <= 0) {
      if (deltaY > 0) {
        deltaY = y_range - this.trackPos.y;
      } else {
        deltaY = 0 - this.trackPos.y;
      }
      this.y_vel = - this.y_vel;
    }
    this.pos.x += deltaX;
    this.pos.y += deltaY;
    this.trackPos.x += deltaX;
    this.trackPos.y += deltaY;

    // lerp speed
    let x_percent = Math.abs(this.trackPos.x - x_range/2) / (x_range/2);
  }

  draw(ctx: CanvasRenderingContext2D, offsetX:number) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(this.pos.x-offsetX, this.pos.y);
    ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    ctx.restore();
  }
}
