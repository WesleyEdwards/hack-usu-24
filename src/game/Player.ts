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
import { debounceLog } from "./helpers";
import { Coor } from "./types";

const timeToJumpPeak = playerJumpSpeed / gravity;

const playerInitPos: Coor = { x: 200, y: 200 };

export class Player {
  pos: Coor;
  prevPos: Coor;
  vel: Coor = { x: 0, y: 0 };
  canJump = true;

  constructor() {
    this.prevPos = { ...playerInitPos };
    this.pos = { ...playerInitPos };
  }

  update(deltaTime: number, keys: Keys) {
    debounceLog(this.vel)
    this.prevPos = { ...this.pos };
    this.pos.x += this.vel.x * deltaTime/1000;
    this.pos.y += this.vel.y * deltaTime/1000;

    if (keys.jump && this.canJump) {
      console.log("jumping")
      this.canJump = false
      this.vel.y = -1500;
      this.pos.y += -10;
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
      this.canJump = true;
    } else {
      this.vel.y += gravity * deltaTime/1000;
      this.canJump = false;
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
    this.canJump = true;
  }
}
