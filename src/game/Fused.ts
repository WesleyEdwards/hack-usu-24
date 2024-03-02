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
  x_speed=max_speed/2;
  y_speed=max_speed;
  x_direction=1;
  y_direction=1;
  trackPos = {x:0, y:0};

  constructor(initPos: Coor) {
    this.prevPos = initPos;
    this.pos = initPos;

    // pick random starting point
    const x_start = Math.random() * x_range;
    const y_start = Math.random() * y_range;
    this.prevPos.x += x_start;
    this.pos.x += x_start;
    this.prevPos.y += y_start;
    this.pos.y += y_start;
    this.trackPos.x = x_start;
    this.trackPos.y = y_start;

    // pick random starting direction
    this.x_direction = Math.random() > 0.5 ? 1 : -1;
    this.y_direction = Math.random() > 0.5 ? 1 : -1;
  }

  update(deltaTime: number) {
    // update prevPos
    this.prevPos = { ...this.pos };

    // Find delta position
    let deltaX = this.x_speed * this.x_direction * deltaTime/1000;
    let deltaY = this.y_speed * this.y_direction * deltaTime/1000;
    // cap delta positions + handle turning
    if ((deltaX + this.trackPos.x) >= x_range || (deltaX + this.trackPos.x) <= 0) {
      if (deltaX > 0) {
        deltaX = x_range - this.trackPos.x;
      } else {
        deltaX = 0 - this.trackPos.x;
      }
      this.x_direction = -this.x_direction
    }
    if ((deltaY + this.trackPos.y) >= y_range || (deltaY + this.trackPos.y) <= 0) {
      if (deltaY > 0) {
        deltaY = y_range - this.trackPos.y;
      } else {
        deltaY = 0 - this.trackPos.y;
      }
      this.y_direction = - this.y_direction;
    }

    // update positions
    this.pos.x += deltaX;
    this.pos.y += deltaY;
    this.trackPos.x += deltaX;
    this.trackPos.y += deltaY;

    // lerp speed
    const x_percent = Math.abs(this.trackPos.x - x_range/2) / (x_range/2);
    const y_percent = Math.abs(this.trackPos.y - y_range/2) / (y_range/2);
    const x_lerp_percent = x_percent > 0.75 ? (x_percent - 0.75) * 4 : 0
    const y_lerp_percent = y_percent > 0.75 ? (y_percent - 0.75) * 4 : 0
    console.log(y_lerp_percent)
    this.x_speed = max_speed/2 * (1-x_lerp_percent); 
    this.y_speed = max_speed * (1-y_lerp_percent);
    // cap slowdown
    this.x_speed = this.x_speed > 15 ? this.x_speed : 15;
    this.y_speed = this.y_speed > 15 ? this.y_speed : 15;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX:number) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(this.pos.x-offsetX, this.pos.y);
    ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    ctx.restore();
  }
}
