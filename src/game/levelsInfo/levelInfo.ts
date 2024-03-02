import { FusedProps } from "../Fused";
import { LevelNumber } from "../GameState";
import { ParshendiProps } from "../Parshendi";
import { PlatProps } from "../Platform";
import level1 from "./level1.json";
import level2 from "./level2.json";
import level3 from "./level3.json";
import level4 from "./level4.json";
import nightLevel from "./nightLevel.json";
import flipGravity from "./flipGravity.json";
import slowTime from "./slowTime.json";
import speedUpTime from "./speedUpTime.json";
import shortenWeaponDist from "./shortenWeaponDist.json";

export type Level = {
  platProps: PlatProps[];
  fusedProps: FusedProps[];
  parshendiProps: ParshendiProps[];
};

export function getLevelInfo(level: LevelNumber) {
  const levelMap: Record<LevelNumber, Level> = {
    0: level1,
    1: level2,
    2: level3,
    3: level4,
    4: nightLevel,
    5: flipGravity,
    6: slowTime,
    7: speedUpTime,
    8: shortenWeaponDist,
  };
  if (level in levelMap) return levelMap[level];
  return { ...level1 };
}
