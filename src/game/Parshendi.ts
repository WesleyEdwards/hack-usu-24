import { Coor } from "./types";
import { canvasHeight, gravity } from "../constants";
import { debounceLog } from "./helpers";
import { eucDistance } from "./miscFunctions";
import { Spear } from "./Spear";
export const parshendiWidth = 100;
export const parshendiHeight = 100;

export type ParshendiProps = {
  initPos: Coor;
};

export class Parshendi {
  pos: Coor;
  prevPos: Coor;
  x_direction: number;
  y_vel = 0;
  x_speed = 100;
  time_since_turn = 0;
  time_since_jump = 0;
  time_since_throw = 2;

  get center():Coor{
    return {x:this.pos.x+parshendiWidth/2, y:this.pos.y+parshendiWidth/2}
  }
  constructor(props: ParshendiProps) {
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };
    this.x_direction = Math.random() > 0.5 ? 1 : -1;
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    // debounceLog(this.pos)
    // update y velocity + position
    this.pos.y += (this.y_vel * deltaTime) / 1000;
    this.pos.x += (this.x_speed * this.x_direction * deltaTime) / 1000;
    if (this.pos.y + parshendiHeight > canvasHeight) {
      this.pos.y = canvasHeight - parshendiHeight;
      this.y_vel = 0;
    } else {
      this.y_vel += (gravity * deltaTime) / 1000;
    }
    // debounceLog(this.y_vel)

    // Decide to jump
    if (this.time_since_jump + Math.random() * 2000 > 10000) {
      console.log("jumping");
      this.time_since_jump = 0;
      this.y_vel = -1500;
      this.pos.y += -10;
    } else {
      this.time_since_jump += deltaTime;
    }

    // update x velocity + position
    if (this.time_since_turn + Math.random() * 2000 > 5000) {
      this.time_since_turn = 0;
      this.x_direction = -this.x_direction;
    } else {
      this.time_since_turn += deltaTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "green";
    ctx.translate(this.pos.x + offsetX, this.pos.y);
    ctx.fillRect(0, 0, parshendiWidth, parshendiHeight);
    ctx.restore();
  }

  setOnPlatform(y: number) {
    if (this.y_vel > 0) {
      this.pos.y = y - parshendiHeight;
      this.y_vel = 0;
    }
  }

  shouldThrow(playerPos:Coor, deltaTime:number, spears:Spear[]) {
    // debounceLog("deciding to throw")
    // debounceLog(eucDistance(playerPos, this.center))
    if (eucDistance(playerPos, this.center) <= 700) {
      this.time_since_throw += deltaTime/1000;
      // debounceLog(this.time_since_throw)
      if (this.time_since_throw > 5) {
        console.log("throwing")
        // time to throw
        this.time_since_throw=0;
        spears.push(new Spear({initPos:this.pos, dest:playerPos}))
      }
    }
  }
}
