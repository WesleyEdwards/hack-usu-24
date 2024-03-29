import { Coor } from "./types";
import { canvasHeight } from "../constants";
import { eucDistance, playSoundEffect } from "./miscFunctions";
import { Spear } from "./Spear";
import { ParshendiDrawManager } from "./ParshendiDrawManager";
import hitSFX from "../assets/sound/enemyDie.ogg"
import spear1 from "../assets/sound/swish_2.wav";
import spear2 from "../assets/sound/swish_3.wav";
import spear3 from "../assets/sound/swish_4.wav";

const spearSFX = [spear1, spear2, spear3];
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
  init_pos: Coor;
  state: "alive" | "hit" = "alive";
  drawManager: ParshendiDrawManager = new ParshendiDrawManager();
  type: "armored" | "fused" = Math.random() > 0.5 ? "armored" : "fused";

  get center(): Coor {
    return {
      x: this.pos.x + parshendiWidth / 2,
      y: this.pos.y + parshendiWidth / 2,
    };
  }
  constructor(props: ParshendiProps) {
    this.init_pos = { ...props.initPos };
    this.prevPos = { ...props.initPos };
    this.pos = { ...props.initPos };
    this.x_direction = Math.random() > 0.5 ? 1 : -1;
  }

  update(deltaTime: number) {
    this.drawManager.update(deltaTime);
    this.prevPos = { ...this.pos };
    // update y velocity + position
    this.pos.y += (this.y_vel * deltaTime) / 1000;
    this.pos.x += (this.x_speed * this.x_direction * deltaTime) / 1000;
    if (this.pos.y + parshendiHeight > canvasHeight) {
      this.pos.y = canvasHeight - parshendiHeight;
      this.y_vel = 0;
    } else {
      this.y_vel += (window.gravity * deltaTime) / 1000;
    }

    // Decide to jump
    if (this.time_since_jump + Math.random() * 2000 > 10000) {
      this.time_since_jump = 0;
      const direction = window.gravity > 0 ? -1 : 1;
      this.y_vel = direction * 1500;
      this.pos.y += direction * 10;
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
    this.drawManager.draw(ctx, this, offsetX);
    // ctx.save();
    // ctx.fillStyle = "green";
    // ctx.translate(this.pos.x + offsetX, this.pos.y);
    // if (window.gravity < 0) {
    //   ctx.scale(1, -1);
    //   ctx.translate(0, -parshendiHeight);
    // }
    // ctx.fillRect(0, 0, parshendiWidth, parshendiHeight);
    // ctx.restore();
  }

  setOnPlatform(y: number) {
    if (this.y_vel > 0) {
      this.pos.y = y - parshendiHeight;
      this.y_vel = 0;
    }
    if (window.gravity > 0 && this.y_vel > 0) {
      this.pos.y = y - parshendiHeight;
    } else if (this.y_vel < 0) {
      this.pos.y = y;
    }
    this.y_vel = 0;
  }

  shouldThrow(playerPos: Coor, deltaTime: number, spears: Spear[]) {
    // debounceLog("deciding to throw")
    // debounceLog(eucDistance(playerPos, this.center))
    if (eucDistance(playerPos, this.center) <= 700) {
      this.time_since_throw += deltaTime / 1000;
      // debounceLog(this.time_since_throw)
      if (this.time_since_throw > 5) {
        // time to throw
        playSoundEffect(spearSFX[Math.floor(Math.random()*spearSFX.length)])
        this.time_since_throw = 0;
        const distance = eucDistance(playerPos, this.center);
        spears.push(
          new Spear({
            initPos: this.center,
            dest: { x: playerPos.x, y: playerPos.y - distance * 0.8 },
          })
        );
      }
    }
  }

  get facing() {
    return this.x_direction === 1 ? "right" : "left";
  }

  hit() {
    playSoundEffect(hitSFX);
    this.state = "hit";
  }
}
