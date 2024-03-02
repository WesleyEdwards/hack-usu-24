import { FusedProps } from "../Fused";
import { ParshendiProps } from "../Parshendi";
import { PlatProps } from "../Platform";
import level1 from "./level1.json";
import level2 from "./level2.json";

export type Level = {
  platProps: PlatProps[];
  fusedProps: FusedProps[];
  parshendiProps: ParshendiProps[];
};

export function getLevelInfo(level: number) {
  console.log(level)
  if (level === 0) {
    return { ...level1 };
  }
  return {...level2}
}
