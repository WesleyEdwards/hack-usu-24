import {
  canvasHeight,
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
import { PlayerDrawManager, runningSpriteFrequency } from "./PlayerDrawManager";
import { Keys } from "./eventListeners";
import { Coor } from "./types";
import { ShootProps } from "./PlayerShoot";
import { ModifyUI } from "../App";
import jumpSFX from "../assets/sound/jump.ogg";
import footstep5 from "../assets/sound/footstep05.ogg";
import footstep6 from "../assets/sound/footstep06.ogg";
import footstep7 from "../assets/sound/footstep07.ogg";
import footstep8 from "../assets/sound/footstep08.ogg";
import footstep9 from "../assets/sound/footstep09.ogg";
import orbSFX from "../assets/sound/orb.ogg";
import hit1 from "../assets/sound/hit10.mp3.flac";
import hit2 from "../assets/sound/hit11.mp3.flac";
import hit3 from "../assets/sound/hit12.mp3.flac";
import hit4 from "../assets/sound/hit13.mp3.flac";

import { playSoundEffect } from "./miscFunctions";
const footsteps = [footstep5, footstep6, footstep7, footstep8, footstep9];
const hits = [hit1, hit2, hit3, hit4];
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
  windowDarken = 0.99;
  life_opacity = 0;
  state: "live" | "dead" = "live";
  invTime = 0;
  step_index = 0;
  step_time = 0;

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
      const direction = window.gravity > 0 ? -1 : 1;
      this.vel.y = direction * playerJumpSpeed;
      this.pos.y += direction;
      playSoundEffect(jumpSFX);
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

    if (this.pos.y + playerHeight > canvasHeight + 1000) {
      this.state = "dead";
    } else if (this.pos.y < -playerHeight - 1000) {
      this.state = "dead";
    } else {
      if (this.vel.y === 0 && this.coyoteTime < maxCoyoteTime) {
        // debounceLog("asdf");
      } else {
        this.vel.y += (window.gravity * deltaTime) / 1000;
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
      this.drawManager.hitTimer = 0;
      keys.hit = false;
      this.handleShoot();
      modifyUi.setShaking(true);
    } else {
      this.hitTimer += deltaTime / 1000;
    }

    this.drawManager.update(deltaTime);

    this.life_opacity -= (deltaTime / 1000) * 0.33;
    if (this.life_opacity < 0) {
      this.life_opacity = 0;
    }

    this.invTime -= deltaTime / 1000;
    if (this.invTime < 0) {
      this.invTime = 0;
    }
    // footsteps
    if (this.vel.x != 0 && this.canJump) {
      this.step_time += deltaTime;
      if (this.step_time >= runningSpriteFrequency * 2.5) {
        this.step_time = 0;
        const i = Math.floor(Math.random() * footsteps.length);
        playSoundEffect(footsteps[i]);
        this.step_index += 1;
        if (this.step_index > footsteps.length) {
          this.step_index = 0;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawManager.draw(ctx, this);
  }

  setOnPlatform(y: number) {
    this.coyoteTime = 0;
    if (window.gravity > 0) {
      this.pos.y = y - playerHeight;
    } else {
      this.pos.y = y;
    }
    this.vel.y = 0;
    this.canJump = true;
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
    playSoundEffect(orbSFX);
    if (this.windowShakeDist < maxWindowShakeDist) {
      this.windowShakeDist += 1;
      this.windowDarken -= 0.03;
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty("--move-up-and-down", `${this.windowShakeDist}px`);
      rootStyle.setProperty("--darken", `${this.windowDarken}`);
    }
  }

  takeDamage(what: "spear" | "parshendi" | "fused" | "soulDrain") {
    if (this.invTime <= 0 || what == "soulDrain") {
      switch (what) {
        case "spear":
          this.health -= 10;
          break;
        case "parshendi":
          this.health -= 30;
          break;
        case "fused":
          this.health -= 20;
          break;
        case "soulDrain":
          this.health -= 5;
          break;
      }
      if (what != "soulDrain") {
        const i = Math.floor(Math.random() * hits.length);
        playSoundEffect(hits[i]);
      }
      this.invTime = 1;
      if (this.health <= 0) {
        this.state = "dead";
        this.health = 0;
      }
    }
    this.life_opacity = 1;
  }

  respawn() {
    this.health = 100;
    this.state = "live";
  }
}
