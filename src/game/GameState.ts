import { ModifyUI } from "../App";
import {
  initialGravity,
  initialShootTerminateDist,
  levelTimerTime,
  playerDistFromLeft,
  winXPos,
} from "../constants";
import { Background } from "./Background";
import { Fused } from "./Fused";
import { Parshendi } from "./Parshendi";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { PlayerShoot, ShootProps } from "./PlayerShoot";
import { Smoke } from "./Smoke";
import { Spear } from "./Spear";
import {
  Keys,
  addDevClickListeners,
  addEventListeners,
} from "./eventListeners";
import { Level, getLevelInfo } from "./levelsInfo/levelInfo";
import {
  calculateFuseShootCollision,
  calculateFusedSpear,
  calculateParshendiPlatCollision,
  calculateParshendiShootCollision,
  calculateParshendiSpear,
  calculatePlayerEnemyCollision,
  calculatePlayerPlatCollision,
} from "./miscFunctions";
import { Coor } from "./types";

export type StateOfGame =
  | "playing"
  | "levelIntro"
  | "lostLevel"
  | "lostGame"
  | "wonGame";

export type NightMod =
  | "gravity-"
  | "gravity+"
  | "shootTermDist-"
  | "spear+"
  | "invertGravity"
  | "timeSpeed+"
  | "timeSpeed-"
  | "soulDrain";

export type LevelNumber = 0 | 1 | 2 | 3 | 4 | 5;

const levelToNightMod: Record<LevelNumber, NightMod[]> = {
  0: ["spear+"],
  1: ["gravity-"],
  2: ["gravity-"],
  3: ["invertGravity"],
  4: ["gravity-"],
  5: ["invertGravity"],
};

export class GameState {
  player = new Player();
  fused: Fused[];
  parshendi: Parshendi[];
  spears: Spear[] = [];
  background = new Background();
  platforms: Platform[];
  keys: Keys;
  gameState: StateOfGame = "levelIntro";
  levelTimer = 0;
  level: LevelNumber = 5;
  playerShoot: PlayerShoot | null = null;
  smoke: Smoke = new Smoke();

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
    window.gravity = initialGravity;
    window.shootTerminateDist = initialShootTerminateDist;
    window.spearVelMultiplier = 1;
    window.timeMultiplier = 1;
    this.levelTimer = 0;
    const level = getLevelInfo(this.level);
    this.player = new Player();
    this.fused = level.fusedProps.map((props) => new Fused(props));
    this.parshendi = level.parshendiProps.map((props) => new Parshendi(props));
  }

  update(deltaTime: number, modifyUi: ModifyUI) {
    if (window.stopGame === true || this.gameState === "lostGame") {
      this.gameState = "lostGame";
      return;
    }
    this.levelTimer += deltaTime;
    if (this.levelTimer > levelTimerTime) {
      this.gameState = "playing";
    }
    if (this.gameState !== "playing") {
      return;
    }

    deltaTime *= window.timeMultiplier;

    this.player.update(
      deltaTime,
      this.keys,
      this.handleShoot.bind(this),
      modifyUi,
      !!this.playerShoot
    );
    this.fused.forEach((f) => f.update(deltaTime, this.player.pos.x));
    this.fused = this.fused.filter((f) => f.state !== "hit");
    this.parshendi = this.parshendi.filter((f) => f.state !== "hit");
    this.parshendi.forEach((p) => p.update(deltaTime));
    this.spears.forEach((s) => s.update(deltaTime));
    this.spears = this.spears.filter((s) => s.live);
    calculatePlayerPlatCollision(this.player, this.platforms, this.keys.down);
    if (this.player.pos.x > winXPos) {
      this.level++;
      this.reset();
      this.gameState = "levelIntro";
      this.levelTimer = 0;
    }
    calculateParshendiPlatCollision(this.parshendi, this.platforms);
    const hitPlayer = calculateParshendiSpear(
      this.parshendi,
      this.player.center,
      this.spears,
      deltaTime
    );
    if (hitPlayer) {
      this.player.takeDamage("spear");
    }

    calculateFusedSpear(this.fused, this.player.center, this.spears, deltaTime);
    calculateFuseShootCollision(this.fused, this.playerShoot);
    calculateParshendiShootCollision(this.parshendi, this.playerShoot);
    const hit = calculatePlayerEnemyCollision(
      this.player,
      this.fused,
      this.parshendi
    );

    if (hit) {
      this.player.takeDamage(hit);
    }
    this.playerShoot?.update(deltaTime, this.player.center);
    if (!this.playerShoot?.live) {
      this.playerShoot = null;
    }
    if (this.player.state == "dead") {
      this.handleLoseLife(modifyUi);
      this.player.respawn();
    }
  }

  draw() {
    if (this.gameState !== "playing") {
      this.background.dispLevelInfo(this.ctx, this.level, this.gameState);
    } else {
      this.background.draw(this.ctx, this.offsetX);

      this.platforms.forEach((p) => p.draw(this.ctx, this.offsetX));

      this.fused.forEach((f) => f.draw(this.ctx, this.offsetX));
      this.parshendi.forEach((p) => p.draw(this.ctx, this.offsetX));
      this.player.draw(this.ctx);
      this.spears.forEach((s) => s.draw(this.ctx, this.offsetX));
      this.playerShoot?.draw(this.ctx, this.offsetX);
    }
  }

  handleLoseLife(modifyUi: ModifyUI) {
    modifyUi.decrementLife();
    this.reset();
    this.gameState = "lostLevel";
    this.levelTimer = 0;
  }

  get offsetX() {
    return playerDistFromLeft - this.player.pos.x;
  }

  handleShoot(props: ShootProps) {
    this.playerShoot = new PlayerShoot(props);
    this.handleNightMod();
  }

  handleClick(e: MouseEvent) {
    const coors: Coor = { x: e.offsetX - this.offsetX, y: e.offsetY };
    const makeFloor = e.shiftKey;
    if (e.ctrlKey) {
      this.platforms.push(
        new Platform({
          initPos: {
            x: +coors.x.toFixed(0),
            y: makeFloor ? 650 : +coors.y.toFixed(0),
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
      fusedProps: this.fused.map((f) => ({ initPos: f.init_pos })),
      parshendiProps: this.parshendi.map((p) => ({ initPos: p.init_pos })),
    };
    console.log(level);
  }

  handleNightMod() {
    const mods =
      this.level in levelToNightMod
        ? levelToNightMod[this.level]
        : levelToNightMod[0];
    if (mods.includes("gravity-") && window.gravity > 0.5) {
      window.gravity *= 0.95;
    }
    if (mods.includes("gravity+") && window.gravity < 9000) {
      window.gravity *= 1.08;
    }
    if (mods.includes("shootTermDist-") && window.shootTerminateDist > 100) {
      window.shootTerminateDist *= 0.8;
    }
    if (mods.includes("spear+")) {
      window.spearVelMultiplier *= 1.1;
    }
    if (mods.includes("invertGravity")) {
      window.gravity = -window.gravity;
    }
    if (mods.includes("timeSpeed+") && window.timeMultiplier < 3) {
      window.timeMultiplier += 0.2;
    }
    if (mods.includes("timeSpeed-") && window.timeMultiplier > 0.25) {
      window.timeMultiplier -= 0.05;
    }
    if (mods.includes("soulDrain")) {
      this.player.takeDamage("soulDrain");
    }
  }
}
