import {
  canvasHeight,
  gravity,
  playerDistFromLeft,
  playerHeight,
  playerJumpSpeed,
  playerSpeedX,
  playerWidth,
} from "../constants";
import { Keys } from "./eventListeners";
import { Coor } from "./types";

const timeToJumpPeak = playerJumpSpeed / gravity;

const playerInitPos: Coor = { x: 200, y: 200 };

export class Player {
  pos: Coor;
  prevPos: Coor;
  vel: Coor = { x: 0, y: 0 };
  jumpTimer = 0;

  constructor() {
    this.prevPos = { ...playerInitPos };
    this.pos = { ...playerInitPos };
  }

  update(deltaTime: number, keys: Keys) {
    this.prevPos = { ...this.pos };
    this.jumpTimer += deltaTime;
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    if (keys.jump || keys.jumpBuffer) {
      if (this.vel.y < 1) {
        keys.jumpBuffer = false;
      }
      // doesn't work. needs work
      if (this.jumpTimer > timeToJumpPeak + 5 && this.vel.y === 0) {
        this.vel.y = -playerJumpSpeed;
        keys.jumpBuffer = false;
        this.jumpTimer = 0;
      }
    }

    if (keys.left && this.pos.x > 0) {
      this.vel.x = -playerSpeedX;
    } else if (keys.right) {
      this.vel.x = playerSpeedX;
    } else {
      this.vel.x = 0;
    }

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

  setOnPlatform(y: number) {
    this.pos.y = y - playerHeight;
    this.vel.y = 0;
  }
}
