import { FusedProps } from "../Fused";
import { LevelNumber } from "../GameState";
import { ParshendiProps } from "../Parshendi";
import { PlatProps } from "../Platform";
import level1 from "./level1.json";
import weakerGravity from "./weakerGravity.json";
import fasterSpears from "./fasterSpears.json";
import nightLevel from "./nightLevel.json";
import flipGravity from "./flipGravity.json";
import slowTime from "./slowTime.json";
import speedUpTime from "./speedUpTime.json";
import shortenWeaponDist from "./shortenWeaponDist.json";
import takeDamage from "./takeDamage.json";

export type Level = {
  platProps: PlatProps[];
  fusedProps: FusedProps[];
  parshendiProps: ParshendiProps[];
};

export function getLevelInfo(level: LevelNumber) {
  const levelMap: Record<LevelNumber, Level> = {
    0: nightLevel,
    1: weakerGravity,
    2: flipGravity,
    3: fasterSpears,
    4: slowTime,
    5: speedUpTime,
    6: shortenWeaponDist,
    7: takeDamage,
  };
  if (level in levelMap) return levelMap[level];
  return { ...level1 };
}
