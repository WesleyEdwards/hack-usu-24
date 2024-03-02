import {
  canvasHeight,
  gravity,
  maxCoyoteTime,
  maxWindowShakeDist,
  playerDistFromLeft,
  playerHeight,
  playerJumpSpeed,
  playerShootDistFromPlayer,
  playerShootSpeed,
  playerSpeedX,
  playerWidth,
} from "../constants";
import { Spear } from "./Spear";
import { PlayerDrawManager } from "./PlayerDrawManager";
import { Keys } from "./eventListeners";
import { Coor } from "./types";
import { ShootProps } from "./PlayerShoot";
import { ModifyUI } from "../App";

const playerInitPos: Coor = { x: playerDistFromLeft, y: 400 };

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
  hitTimer = 0;
  windowShakeDist = 0;
  coyoteTime = 0;

  constructor() {
    this.prevPos = { ...playerInitPos };
    this.pos = { ...playerInitPos };
  }

  update(
    deltaTime: number,
    keys: Keys,
    shoot: (props: ShootProps) => void,
    modifyUi: ModifyUI,
    isShooting: boolean
  ) {
    this.prevPos = { ...this.pos };
    this.pos.x += (this.vel.x * deltaTime) / 1000;
    this.pos.y += (this.vel.y * deltaTime) / 1000;
    this.coyoteTime += deltaTime;

    if (keys.jump && this.canJump) {
      this.canJump = false;
      this.vel.y = -playerJumpSpeed;
      this.pos.y -= 1;
    }

    if ((keys.left && keys.right) || (!keys.left && !keys.right)) {
      this.vel.x = 0;
    } else {
      if (keys.left) {
        this.vel.x = -playerSpeedX;
        this.lookDirectionX = "left";
      }
      if (keys.right) {
        this.vel.x = playerSpeedX;
        this.lookDirectionX = "right";
      }
    }

    if (this.vel.x < 0 && this.pos.x < 0) {
      this.vel.x = 0;
    }

    if (this.pos.y + playerHeight > canvasHeight) {
      this.pos.y = canvasHeight - playerHeight;
      this.vel.y = 0;
      this.canJump = true;
    } else {
      if (this.vel.y === 0 && this.coyoteTime < maxCoyoteTime) {
        // debounceLog("asdf");
      } else {
        this.vel.y += (gravity * deltaTime) / 1000;
        this.canJump = false;
      }
    }

    if (keys.up) {
      this.lookDirectionY = "up";
    } else if (keys.down) {
      this.lookDirectionY = "down";
    } else {
      this.lookDirectionY = "straight";
    }
    if (keys.hit && !isShooting) {
      shoot(this.shootProps);
      keys.hit = false;
      this.handleShoot();
      modifyUi.setShaking(true);
    } else {
      this.hitTimer += deltaTime / 1000;
    }

    this.drawManager.update(deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawManager.draw(ctx, this);
  }

  setOnPlatform(y: number) {
    this.coyoteTime = 0;
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

  get hitting() {
    return this.hitTimer < 0.2;
  }

  get shootProps(): ShootProps {
    return {
      initPos: (() => {
        if (this.lookDirectionY === "up") {
          return {
            x: this.center.x,
            y: this.pos.y - playerShootDistFromPlayer,
          };
        }
        if (this.lookDirectionY === "down") {
          return {
            x: this.center.x,
            y: this.pos.y + playerHeight + playerShootDistFromPlayer,
          };
        }
        if (this.lookDirectionX === "left") {
          return {
            x: this.pos.x - playerShootDistFromPlayer,
            y: this.center.y,
          };
        }
        if (this.lookDirectionX === "right") {
          return {
            x: this.pos.x + playerWidth + playerShootDistFromPlayer,
            y: this.center.y,
          };
        }
        return { x: 0, y: 0 };
      })(),
      vel: (() => {
        if (this.lookDirectionY === "up") {
          return { x: 0, y: -playerShootSpeed };
        }
        if (this.lookDirectionY === "down") {
          return { x: 0, y: playerShootSpeed };
        }
        if (this.lookDirectionX === "left") {
          return { x: -playerShootSpeed, y: 0 };
        }
        if (this.lookDirectionX === "right") {
          return { x: playerShootSpeed, y: 0 };
        }
        return { x: 0, y: 0 };
      })(),
    };
  }

  handleShoot() {
    this.hitTimer = 0;
    if (this.windowShakeDist < maxWindowShakeDist) {
      this.windowShakeDist += 1;
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty("--move-up-and-down", `${this.windowShakeDist}px`);
    }
  }
}
