import { FusedProps } from "../Fused";
import { ParshendiProps } from "../Parshendi";
import { PlatProps } from "../Platform";
import level1 from "./level1.json";
import level2 from "./level2.json";
import level3 from "./level3.json";
import level4 from "./level4.json";

export type Level = {
  platProps: PlatProps[];
  fusedProps: FusedProps[];
  parshendiProps: ParshendiProps[];
};

export function getLevelInfo(level: number) {
  console.log(level);
  if (level === 0) {
    return { ...level1 };
  }
  if (level === 1) {
    return { ...level2 };
  }
  if (level === 2) {
    return { ...level3 };
  }
  return { ...level4 };
}
