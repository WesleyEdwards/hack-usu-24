import { canvasHeight, gravity } from "../constants";
import { playerDistFromLeft } from "./GameState";
import { Keys } from "./eventListeners";
import { Coor } from "./types";

const playerWidth = 30;
const playerHeight = 30;
const playerSpeedX = 3;
const playerJumpSpeed = 0.9;

const playerInitPos: Coor = {
  x: 200,
  y: 200,
};

export class Player {
  pos: Coor;
  prevPos: Coor;
  vel: Coor = { x: 0, y: 0 };

  constructor() {
    this.prevPos = { ...playerInitPos };
    this.pos = { ...playerInitPos };
  }

  update(deltaTime: number, keys: Keys) {
    this.prevPos = { ...this.pos };
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    if (keys.jump || keys.jumpBuffer) {
      this.vel.y = -playerJumpSpeed;
      keys.jumpBuffer = false;
    }

    if (keys.left) {
      this.vel.x = -playerSpeedX;
    } else if (keys.right) {
      this.vel.x = playerSpeedX;
    } else this.vel.x = 0;

    if (this.pos.y + playerHeight > canvasHeight) {
      this.pos.y = canvasHeight - playerHeight;
      this.vel.y = 0;
    } else {
      this.pos.y += this.vel.y += gravity;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.translate(playerDistFromLeft, this.pos.y);
    ctx.fillRect(0, 0, playerWidth, playerHeight);
    ctx.restore();
  }
}
