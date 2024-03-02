import { Spear } from "./Spear";
import { eucDistance } from "./miscFunctions";
import { Coor } from "./types";
const fusedWidth = 100;
const fusedHeight = 100;
const y_range = fusedHeight * 2;
const x_range = fusedWidth / 2;
const max_speed = 150;

export type FusedProps = {
  initPos: Coor;
};

export class Fused {
  pos: Coor;
  prevPos: Coor;
  x_speed = max_speed / 2;
  y_speed = max_speed;
  x_direction = 1;
  y_direction = 1;
  trackPos = { x: 0, y: 0 };
  time_since_throw = 2;

  get center() {
    return {x:this.pos.x+fusedWidth/2, y:this.pos.y+fusedHeight/2}
  }

  constructor(props: FusedProps) {
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };

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
    let deltaX = (this.x_speed * this.x_direction * deltaTime) / 1000;
    let deltaY = (this.y_speed * this.y_direction * deltaTime) / 1000;
    // cap delta positions + handle turning
    if (deltaX + this.trackPos.x >= x_range || deltaX + this.trackPos.x <= 0) {
      if (deltaX > 0) {
        deltaX = x_range - this.trackPos.x;
      } else {
        deltaX = 0 - this.trackPos.x;
      }
      this.x_direction = -this.x_direction;
    }
    if (deltaY + this.trackPos.y >= y_range || deltaY + this.trackPos.y <= 0) {
      if (deltaY > 0) {
        deltaY = y_range - this.trackPos.y;
      } else {
        deltaY = 0 - this.trackPos.y;
      }
      this.y_direction = -this.y_direction;
    }

    // update positions
    this.pos.x += deltaX;
    this.pos.y += deltaY;
    this.trackPos.x += deltaX;
    this.trackPos.y += deltaY;

    // lerp speed
    const x_percent = Math.abs(this.trackPos.x - x_range / 2) / (x_range / 2);
    const y_percent = Math.abs(this.trackPos.y - y_range / 2) / (y_range / 2);
    const x_lerp_percent = x_percent > 0.75 ? (x_percent - 0.75) * 4 : 0;
    const y_lerp_percent = y_percent > 0.75 ? (y_percent - 0.75) * 4 : 0;

    this.x_speed = (max_speed / 2) * (1 - x_lerp_percent);
    this.y_speed = max_speed * (1 - y_lerp_percent);
    // cap slowdown
    this.x_speed = this.x_speed > 15 ? this.x_speed : 15;
    this.y_speed = this.y_speed > 15 ? this.y_speed : 15;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(this.pos.x + offsetX, this.pos.y);
    ctx.fillRect(0, 0, fusedWidth, fusedHeight);
    ctx.restore();
  }

  shouldThrow(playerPos:Coor, deltaTime:number, spears:Spear[]) {
    // debounceLog("deciding to throw")
    // debounceLog(eucDistance(playerPos, this.center))
    if (eucDistance(playerPos, this.center) <= 700) {
      this.time_since_throw += deltaTime/1000;
      // debounceLog(this.time_since_throw)
      if (this.time_since_throw > 3) {
        console.log("throwing")
        // time to throw
        this.time_since_throw=0;
        spears.push(new Spear({initPos:this.center, dest:playerPos}))
      }
    }
  }
}
