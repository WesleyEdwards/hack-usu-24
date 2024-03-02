import { FusedProps } from "../Fused";
import { LevelNumber } from "../GameState";
import { ParshendiProps } from "../Parshendi";
import { PlatProps } from "../Platform";
import level1 from "./level1.json";
import level2 from "./level2.json";
import level3 from "./level3.json";
import level4 from "./level4.json";
import nightLevel from "./nightLevel.json";

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
  };
  return { ...(levelMap[level] ?? level1) };
}
