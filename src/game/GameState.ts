import { levelTimerTime, playerDistFromLeft, winXPos } from "../constants";
import { Background } from "./Background";
import { Fused } from "./Fused";
import { Parshendi } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { Spear } from "./Spear";
import {
  Keys,
  addDevClickListeners,
  addEventListeners,
} from "./eventListeners";
import { Level, getLevelInfo } from "./levelsInfo/levelInfo";
import {
  calculateFusedSpear,
  calculateParshendiPlatCollision,
  calculateParshendiSpear,
  calculatePlayerPlatCollision,
} from "./miscFunctions";
import { Coor } from "./types";

export class GameState {
  player = new Player();
  fused: Fused[];
  parshendi: Parshendi[];
  spears: Spear[] = [];
  background = new Background();
  platforms: Platform[];
  keys: Keys;
  gameState: "playing" | "levelIntro" = "levelIntro";
  levelTimer = 0;
  level = 0;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.keys = addEventListeners();
    const level = getLevelInfo(this.level);
    this.platforms = level.platProps.map((props) => new Platform(props));
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
    addDevClickListeners(
      this.handleClick.bind(this),
      this.consoleLogLevel.bind(this)
    );
  }

  reset() {
    this.levelTimer = 0;
    const level = getLevelInfo(this.level);
    this.player = new Player();
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
  }

  update(deltaTime: number, decrementLives: () => void) {
    this.levelTimer += deltaTime;
    if (this.levelTimer > levelTimerTime) {
      this.gameState = "playing";
    }
    if (this.gameState === "levelIntro") {
      return;
    }
    this.player.update(deltaTime, this.keys);
    this.fused.forEach((f) => f.update(deltaTime));
    this.parshendi.forEach((p) => p.update(deltaTime));
    this.spears.forEach((p) => p.update(deltaTime));
    this.spears = this.spears.filter(function (spear) {
      return spear.live === true;
    });
    calculatePlayerPlatCollision(this.player, this.platforms, this.keys.down);
    if (this.player.pos.x > winXPos) {
      this.level++;
      this.reset();
      this.gameState = "levelIntro";
      this.levelTimer = 0;
    }
    calculateParshendiPlatCollision(this.parshendi, this.platforms);
    calculateParshendiSpear(
      this.parshendi,
      this.player.center,
      this.spears,
      deltaTime
    );
    calculateFusedSpear(this.fused, this.player.center, this.spears, deltaTime);
  }

  draw() {
    if (this.gameState === "levelIntro") {
      this.background.dispLevelInfo(this.ctx, this.level);
    } else {
      this.background.draw(this.ctx, this.offsetX);
      this.platforms.forEach((p) => p.draw(this.ctx, this.offsetX));

      this.fused.forEach((f) => f.draw(this.ctx, this.offsetX));
      this.parshendi.forEach((p) => p.draw(this.ctx, this.offsetX));
      this.player.draw(this.ctx);
      this.spears.forEach((s) => s.draw(this.ctx, this.offsetX));
    }
  }

  get offsetX() {
    return playerDistFromLeft - this.player.pos.x;
  }

  handleClick(e: MouseEvent) {
    const coors: Coor = { x: e.offsetX - this.offsetX, y: e.offsetY };
    const makeFloor = e.shiftKey;
    if (e.ctrlKey) {
      this.platforms.push(
        new Platform({
          initPos: {
            x: +coors.x.toFixed(0),
            y: makeFloor ? 670 : +coors.y.toFixed(0),
          },
          width: window.selectedWidth ?? 200,
          floor: makeFloor,
        })
      );
    }
  }

  consoleLogLevel() {
    const level: Level = {
      platProps: this.platforms.map((p) => ({
        initPos: p.pos,
        width: p.width,
        floor: p.floor,
      })),
      fusedProps: this.fused.map((f) => ({ initPos: f.pos })),
      parshendiProps: this.parshendi.map((p) => ({ initPos: p.pos })),
    };
    console.log(level);
  }
}
