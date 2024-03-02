import { Coor } from "./types";
import { canvasHeight, gravity } from "../constants";
import { debounceLog } from "./helpers";
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

  constructor(props: ParshendiProps) {
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };
    this.x_direction = Math.random() > 0.5 ? 1 : -1;
  }

  update(deltaTime: number) {
    this.prevPos = { ...this.pos };
    // debounceLog(this.pos)
    // update y velocity + position
    if (this.pos.y + parshendiHeight > canvasHeight) {
      this.pos.y = canvasHeight - parshendiHeight;
      this.y_vel = 0;
    } else {
      this.y_vel += gravity*deltaTime;
    }
    // debounceLog(this.y_vel)
    this.pos.y += this.y_vel * deltaTime/1000;

    // Decide to jump
    if (this.time_since_jump + Math.random() * 2000 > 10000) {
      this.time_since_jump = 0;
      this.y_vel = -1000;
    } else {
      this.time_since_jump += deltaTime;
    }

    // update x velocity + position
    if (this.time_since_turn + Math.random() * 2000 > 5000) {
      this.time_since_turn = 0;
      this.x_direction = - this.x_direction;
    } else {
      this.time_since_turn += deltaTime;
    }

    this.pos.x += this.x_speed * this.x_direction * deltaTime/1000

  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number) {
    ctx.save();
    ctx.fillStyle = "green";
    ctx.translate(this.pos.x + offsetX, this.pos.y);
    ctx.fillRect(0, 0, parshendiWidth, parshendiHeight);
    ctx.restore();
  }

  setOnPlatform(y: number) {
    this.pos.y = y - parshendiHeight;
    this.y_vel = 0;
  }
}
