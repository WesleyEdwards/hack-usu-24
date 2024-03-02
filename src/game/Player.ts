import {
  canvasHeight,
  gravity,
  playerDistFromLeft,
  playerHeight,
  playerJumpSpeed,
  playerSpeedX,
  playerWidth,
} from "../constants";
import { Spear } from "./Spear";
import { PlayerDrawManager } from "./PlayerDrawManager";
import { Keys } from "./eventListeners";
import { Coor } from "./types";

const playerInitPos: Coor = { x: playerDistFromLeft, y: 200 };

export type DirectionX = "left" | "right";
export type DirectionY = "up" | "down" | "straight";

export class Player {
  pos: Coor;
  prevPos: Coor;
  vel: Coor = { x: 0, y: 0 };
  canJump = true;
  health = 100;
  drawManager = new PlayerDrawManager();
  lookDirectionX: DirectionX = "right";
  lookDirectionY: DirectionY = "straight";

  constructor() {
    this.prevPos = { ...playerInitPos };
    this.pos = { ...playerInitPos };
  }

  update(deltaTime: number, keys: Keys) {
    // debounceLog(this.vel)
    this.prevPos = { ...this.pos };
    this.pos.x += (this.vel.x * deltaTime) / 1000;
    this.pos.y += (this.vel.y * deltaTime) / 1000;

    if (keys.jump && this.canJump) {
      this.canJump = false;
      this.vel.y = -playerJumpSpeed;
      this.pos.y -= 1;
    }

    if ((keys.left && keys.right) || (!keys.left && !keys.right)) {
      this.vel.x = 0;
    } else {
      if (keys.left && this.pos.x > 0) {
        this.vel.x = -playerSpeedX;
        this.lookDirectionX = "left";
      }
      if (keys.right) {
        this.vel.x = playerSpeedX;
        this.lookDirectionX = "right";
      }
    }

    if (this.pos.y + playerHeight > canvasHeight) {
      this.pos.y = canvasHeight - playerHeight;
      this.vel.y = 0;
      this.canJump = true;
    } else {
      this.vel.y += (gravity * deltaTime) / 1000;
      this.canJump = false;
    }

    if (keys.up) {
      this.lookDirectionY = "up";
    } else if (keys.down) {
      this.lookDirectionY = "down";
    } else {
      this.lookDirectionY = "straight";
    }

    this.drawManager.update(deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawManager.draw(ctx, this);
  }

  setOnPlatform(y: number) {
    this.pos.y = y - playerHeight;
    this.vel.y = 0;
    this.canJump = true;
  }

  checkCollideSpear(spear: Spear) {
    if (
      spear.center.x >= this.pos.x - 5 &&
      spear.center.x <= this.pos.x + playerWidth + 5 &&
      spear.center.y >= this.pos.y - 5 &&
      spear.center.y <= this.pos.y + playerHeight + 5
    ) {
      // TODO: add function
    }
  }

  get center() {
    return {
      x: this.pos.x + playerWidth / 2,
      y: this.pos.y + playerHeight / 2,
    };
  }
}
